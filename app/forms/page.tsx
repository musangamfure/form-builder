import Form from '@/app/forms/form';
import { getFormsFromUser } from '@/lib/actions/actions';
import { DataTable } from '@/components/formsTable/data-table';
import { columns } from '@/components/formsTable/columns';
import { format } from 'date-fns';

async function Forms() {
  const formsFromUser = await getFormsFromUser();

  if ('error' in formsFromUser) {
    return null;
  }

  const formsFromUserFormmated = formsFromUser.map((element) => {
    return {
      ...element,
      createdAt: format(element.createdAt, 'dd/MM/yyyy'),
      updatedAt: format(element.updatedAt, 'dd/MM/yyyy'),
    };
  });

  return (
    <div className='my-32 mx-48'>
      <div className='mt-12 mb-8'>{<Form></Form>}</div>
      {<DataTable data={formsFromUserFormmated} columns={columns}></DataTable>}
    </div>
  );
}

export default Forms;
