import { Input } from '@/components/ui/input';
import Form from '@/app/forms/form';
import { getFormsFromUser } from '@/lib/actions';
import { DataTable } from '@/components/formsTable/data-table';
import { columns } from '@/components/formsTable/columns';
import { format } from 'date-fns';

type Question = {
  type: 'text';
};

const generateQuestion = (): Question => {
  return {
    type: 'text',
  };
};

const renderQuestion = (props: Question) => {
  if (props.type === 'text') {
    return <div>Hello text</div>;
  }
  return null;
};

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

  const questions = [generateQuestion()];
  return (
    <div className='my-24 mx-24'>
      <div className='mt-12 mb-8'>{<Form></Form>}</div>
      {<DataTable data={formsFromUserFormmated} columns={columns}></DataTable>}
      {questions.map((element) => {
        return renderQuestion(element);
      })}
      <div className='my-12'>
        <Input
          className='border-0 shadow-none focus-visible:ring-0 !focus:border-0 !active:border-0 text-lg font-semibold p-4'
          type='email'
          placeholder='Type the question'
        />
      </div>
      <div className='my-12'>
        <Input
          className='border-0 shadow-none leading-tight tracking-tighter lg:leading-[1.1] p-12'
          type='email'
          placeholder='Type the question'
        />
      </div>
      <input type='text' placeholder='Type a question' />
    </div>
  );
}

export default Forms;
