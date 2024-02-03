import {
  getForm,
  getQuestionsFromUser,
  submitForm,
} from '@/lib/actions/actions';

import Form from './form';

export default async function Page({ params }: { params: { slug: string } }) {
  const form = await getForm(params.slug);
  const questions = await getQuestionsFromUser(params.slug);

  const title = form?.title;

  return (
    <div className='mx-auto my-6 mt-16 sm:mx-24 w-full max-w-xs  sm:max-w-4xl'>
      <div className='text-3xl font-semibold tracking-tight transition-colors'>
        {title}{' '}
      </div>

      <Form questions={questions} form={form} submitForm={submitForm} />
    </div>
  );
}
