import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { MEMBER_COLUMNS } from './member-column';
import { membersFilterConfig } from './members.config';
import { NonNullableFormBuilder } from '@angular/forms';
import { FiltersFormValue, TableFilters } from '../../../shared/ui/table-filters/table-filters';
import { MembersTableFacade } from './data-access/members-table.facade';
import { MembersFiltersFormValue } from './interfaces/members.interface';

@Component({
  selector: 'app-members',
  standalone: true,
  providers: [MembersTableFacade],
  imports: [AsyncPipe, DataTable, TableFilters],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members implements OnInit {
  readonly fb = inject(NonNullableFormBuilder);
  readonly facade = inject(MembersTableFacade);

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
