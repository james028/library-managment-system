import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { MEMBER_COLUMNS } from './member-column';
import { membersFilterConfig } from './members.config';
import { FormBuilder } from '@angular/forms';
import { TableFilters } from '../../../shared/ui/table-filters/table-filters';
import { MembersTableFacade } from './data-access/members-table.facade';

@Component({
  selector: 'app-members',
  standalone: true,
  providers: [MembersTableFacade],
  imports: [AsyncPipe, DataTable, TableFilters],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members implements OnInit {
  fb = inject(FormBuilder);
  readonly facade = inject(MembersTableFacade);

  readonly membersFilterConfig = membersFilterConfig;

  filtersForm!: any;

  protected readonly memberColumns = MEMBER_COLUMNS;

  onFiltersChange(filter: any): void {
    this.filtersForm = filter;
    this.facade.setFilters(filter);
  }

  onResetFilters() {
    this.facade.resetFilters();
  }

  onChangePage(page: number) {
    this.facade.changePage(page);
  }

  ngOnInit(): void {
    this.facade.vm$.subscribe((v) => {
      console.log(v);
    });
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
