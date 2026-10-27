import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { MEMBER_COLUMNS } from './member-column';
import { membersFilterConfig } from './members.config';
import { NonNullableFormBuilder } from '@angular/forms';
import { FiltersFormValue, TableFilters } from '../../../shared/ui/table-filters/table-filters';
import { MembersTableFacade } from './data-access/members-table.facade';
import { Member, MemberEditValue, MembersFiltersFormValue } from './interfaces/members.interface';
import { finalize } from 'rxjs';
import { MemberEdit } from './member-edit/member-edit';

@Component({
  selector: 'app-members',
  standalone: true,
  providers: [MembersTableFacade],
  imports: [AsyncPipe, DataTable, TableFilters, MemberEdit],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members implements OnInit {
  readonly fb = inject(NonNullableFormBuilder);
  readonly facade = inject(MembersTableFacade);

  saving = false;
  selectedMember: Member | null = null;
  saveError: string | null = null;

  readonly membersFilterConfig = membersFilterConfig;

  filtersForm!: any;
  protected readonly memberColumns = MEMBER_COLUMNS;

  onApplySubmit(value: any): void {
    this.facade.applySubmit(value);
  }

  onResetFilters() {
    this.facade.resetFilters();
  }

  onChangePage(page: number) {
    this.facade.changePage(page);
  }

  onEdit(member: Member): void {
    this.selectedMember = member;
    this.saveError = null;
  }

  cancelEdit(): void {
    if (this.saving) {
      return;
    }

    this.selectedMember = null;
    this.saveError = null;
  }

  onSaveEdit(values: Partial<MemberEditValue>) {
    if (!this.selectedMember || this.saving) {
      return;
    }

    this.saving = true;

    this.facade
      .updateMember(this.selectedMember.id, values)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.selectedMember = null;
        },
        error: (err) => {
          this.saveError = 'Nie udało się zapisać zmian.';
        },
      });
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.filtersForm = this.fb.group({
      search: [''],
      status: [''],
      createdFrom: [''],
      createdTo: [''],
      hasActiveLoans: [false],
      hasOverdueLoans: [false],
      hasUnpaidFines: [false],
    });
  }
}
