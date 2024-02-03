import {
  createOption,
  deleteOption,
  deleteQuestion,
  getFormFromUser,
  getQuestionsFromUser,
  togglePublishFormFromUser,
  updateOptionText,
} from '@/lib/actions/actions';

import {
  createOptionQuestion,
  createShortResponseQuestion,
} from '@/lib/actions/questions/create';
import QuestionForm from './form';

export default async function Page({ params }: { params: { slug: string } }) {
  const questions = await getQuestionsFromUser(params.slug);
  const form = await getFormFromUser(params.slug);

  return (
    <>
      {
        <QuestionForm
          title={form?.title}
          questions={questions}
          formId={params.slug}
          createShortResponseQuestion={createShortResponseQuestion}
          deleteQuestion={deleteQuestion}
          togglePublishFormFromUser={togglePublishFormFromUser}
          form={form}
          createOptionQuestion={createOptionQuestion}
          updateOptionText={updateOptionText}
          createOption={createOption}
          deleteOption={deleteOption}
        />
      }
    </>
  );
}
