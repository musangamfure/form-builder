import ResponsePie from '@/components/Pie';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getResponsesSumaryFromUser } from '@/lib/actions/actions';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

const transformData = (data: any) => {
  const questionIdCount = {} as any;
  data.forEach((item: any) => {
    if (!questionIdCount[item.id]) {
      questionIdCount[item.id] = { name: item.optionText, value: 1 };
    } else {
      questionIdCount[item.id].value += 1;
    }
  });

  const result = Object.values(questionIdCount);
  return result;
};

function Question({ question }: any) {
  if (question.type === 'SHORT_RESPONSE') {
    return (
      <Card className='col-span-3 mt-8'>
        <CardHeader>
          <CardTitle> {question.text}</CardTitle>
          <CardDescription>
            {`${question.answers.length} responses`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='space-y-6'>
            {question.answers.map((answer: any) => {
              return (
                <div key={answer.key} className='ml-4 space-y-1'>
                  <p className='text-sm text-muted-backgound'>
                    {answer.answerText}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  } else if (question.type === 'MANY_OPTIONS') {
    const options = transformData(
      question.answers.map((answer: any) => answer.option)
    ) as any[];
    return (
      <Card className='col-span-3 mt-8'>
        <CardHeader>
          <CardTitle> {question.text}</CardTitle>
          <CardDescription>
            {`${question.answers.length} responses`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
            <ResponsePie data={options} />
            {question.answers.map((answer: any) => {
              return (
                <div key={answer.key} className='ml-4 space-y-1'>
                  <p className='text-sm text-muted-backgound'>
                    {answer.answerText}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
}

async function Page({ params }: { params: { slug: string } }) {
  const result = await getResponsesSumaryFromUser(params.slug);

  return (
    <div className='mx-48 my-20'>
      <div className='my-10'>
        <Link href={`/forms`}>
          <div className='flex items-center'>
            {
              <MoveLeft
                className='mr-2'
                color='#000000'
                strokeWidth={1.75}
                absoluteStrokeWidth
                size={18}
              />
            }
            {'Back to my forms'}
          </div>
        </Link>
      </div>
      <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transtion-colors first:mt-0 '>
        Responses
      </h2>

      {result.map((question: any) => {
        return <Question question={question} key={question.id} />;
      })}
    </div>
  );
}

export default Page;
