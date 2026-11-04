import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MembersService } from '../data-access/members.service';
import { filter } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Breadcrumbs } from '../../../../shared/ui/breadcrumbs/breadcrumbs';
import { JsonPipe } from '@angular/common';

export const MEMBER_IMPORT_ACCEPT = '.csv,text/csv';
export const MEMBER_IMPORT_MAX_FILE_SIZE = 2 * 1024 * 1024;

export const MEMBER_IMPORT_TEMPLATE_COLUMNS = [
  'firstName',
  'lastName',
  'email',
  'cardNumber',
  'status',
] as const;

@Component({
  selector: 'app-member-import',
  imports: [JsonPipe, Breadcrumbs],
  templateUrl: './member-import.html',
  styleUrl: './member-import.scss',
})
export class MemberImport {
  readonly selectedFile = signal<File | null>(null);
  readonly fileError = signal<string | null>(null);
  readonly requestError = signal<string | null>(null);
  readonly importResult = signal<any | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly importing = signal<boolean>(false);
  private readonly router = inject(Router);
  private readonly membersService = inject(MembersService);

  constructor() {
    // effect(() => {
    //   console.log('result changed:', this.importResult());
    // });

    console.log('ss');

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(new NavigationEnd(0, this.router.url, this.router.url)), // Emituje aktualny URL na starcie
      )
      .subscribe((event) => {
        console.log('Zakończono nawigację (lub start):', event);
        const root = this.router.routerState.snapshot.root;
        console.log(root);
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.handleFile(input.files?.[0] ?? null);
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.importResult.set(null);
    this.errorMessage.set(null);
  }

  openFilePicker(input: HTMLInputElement) {
    input.click();
  }

  goBack(): void {
    console.log('clicked back');
    this.router.navigate(['admin/members']);
  }

  // async importCsv(): Promise<void> {
  //   const file = this.selectedFile();
  //
  //   if (!file || !this.importing) {
  //     return;
  //   }
  //
  //   this.importing.set(true);
  //   this.requestError.set(null);
  //   this.importResult.set(null);
  //
  //   // this.membersService.importFromCsv(file).subscribe({
  //   //   next: (result) => {
  //   //     this.importResult.set(result);
  //   //     this.importing.set(false);
  //   //   },
  //   //   error: () => {
  //   //     this.requestError.set('Nie udało się zaimportować pliku. Sprawdź plik i spróbuj ponownie.');
  //   //     this.importing.set(false);
  //   //   },
  //   // });
  //
  //   try {
  //     const downloadedCsv = this.membersService.importFromCsv(file);
  //
  //     downloadedCsv.subscribe((a) => {
  //       console.log(a);
  //     });
  //
  //     this.importResult.set(downloadedCsv);
  //
  //     console.log(this.importResult(), ' aaa');
  //     this.selectedFile.set(null);
  //   } catch (e) {
  //     this.requestError.set('Nie udało się zaimportować pliku. Sprawdź plik i spróbuj ponownie.');
  //   } finally {
  //     this.importing.set(false);
  //   }
  // }

  async importCsv(): Promise<void> {
    const file = this.selectedFile();

    if (!file || this.importing()) {
      return;
    }

    this.importing.set(true);
    this.requestError.set(null);
    this.importResult.set(null);

    try {
      const result = await this.membersService.importFromCsv(file);

      this.importResult.set(result);
      this.selectedFile.set(null);
    } catch {
      this.requestError.set('Nie udało się zaimportować pliku. Sprawdź plik i spróbuj ponownie.');
    } finally {
      this.importing.set(false);
    }
  }

  private handleFile(file: File | null): void {
    this.fileError.set(null);
    this.importResult.set(null);
    this.requestError.set(null);

    if (!file) {
      this.selectedFile.set(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.fileError.set('Wybierz plik CSV.');
      this.selectedFile.set(null);
      return;
    }

    if (file.size > MEMBER_IMPORT_MAX_FILE_SIZE) {
      this.fileError.set('Plik jest zbyt duży. Maksymalny rozmiar to 2 MB.');
      this.selectedFile.set(null);
      return;
    }

    this.selectedFile.set(file);
  }
}
