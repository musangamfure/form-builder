import { Row } from '@tanstack/react-table';
import { formSchema } from './data/schema';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

import { useRouter } from 'next/navigation';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { id: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = formSchema.parse(row.original);
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/forms/${row.original.id}`);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/forms/responses/${row.original.id}`);
          }}
        >
          Check responses
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
