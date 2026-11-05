import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MembersService } from '../data-access/members.service';
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.handleFile(input.files?.[0] ?? null);
  }

  openFilePicker(input: HTMLInputElement) {
    input.click();
  }

  goBack(): void {
    this.router.navigate(['admin/members']);
  }

  async importCsv(): Promise<void> {
    const file = this.selectedFile();

    if (!file || !this.importing) {
      return;
    }

    this.importing.set(true);
    this.requestError.set(null);
    this.importResult.set(null);

    this.membersService.importFromCsv(file).subscribe({
      next: (result) => {
        this.importResult.set(result);
        this.importing.set(false);
        this.selectedFile.set(null);
      },
      error: () => {
        this.requestError.set('Nie udało się zaimportować pliku. Sprawdź plik i spróbuj ponownie.');
        this.importing.set(false);
        this.selectedFile.set(null);
      },
    });
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.fileError.set(null);
    this.importResult.set(null);
    this.requestError.set(null);
  }

  reset(): void {
    this.clearFile();
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
