'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Form } from './data/schema';
import { DataTableColumnHeader } from './data-tble-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Form>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='id' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')} </div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {' '}
        {row.getValue('title') ? row.getValue('title') : 'Untitled'}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created at' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'> {row.getValue('createdAt')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated at' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'> {row.getValue('updatedAt')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
