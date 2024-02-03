'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { type Form, type Question, Prisma, type Option } from '@prisma/client';

type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: {
    options: true;
  };
}>;

type ShortResponseAnswer = {
  type: 'SHORT_RESPONSE';
  optionId: null;
  text: string;
};

type ManyOptionsAnswer = {
  type: 'MANY_OPTIONS';
  optionId: string;
  text: string;
};

type OneOptionAnswer = {
  type: 'SELECT_ONE_OPTION';
  optionId: string;
  text: string;
  optionIds: null;
};

type SelectMultipleOptionsAnswer = {
  type: 'SELECT_MULTIPLE_OPTIONS';
  optionIds: string[];
  optionId: null;
  text: string;
};

type Accumulator = {
  [key: string]:
    | ShortResponseAnswer
    | OneOptionAnswer
    | SelectMultipleOptionsAnswer;
};

type SetAnswers = React.Dispatch<React.SetStateAction<Accumulator>>;

export default function Form({
  questions,
  submitForm,
  form,
}: {
  questions: QuestionWithOptions[];
  submitForm: any;
  form: any;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState(
    questions.reduce<Accumulator>((acc: any, question: any) => {
      if (question.type === 'SHORT_RESPONSE') {
        acc[question.id] = {
          type: 'SHORT_RESPONSE',
          optionId: null,
          text: null,
        };
      } else if (question.type === 'MANY_OPTIONS') {
        acc[question.id] = {
          type: 'MANY_OPTIONS',
          optionIds: null,
          text: null,
        };
      }

      return acc;
    }, {})
  );

  return (
    <div className=''>
      <div className='mt-12'>
        {questions.map((element: any) => {
          if (element.type === 'SHORT_RESPONSE') {
            return (
              <div key={element.id} className='mb-5 group relative'>
                <div className='sm:w-1/2 tracking-tight flex h-9 w-full rounded-md border-0 bg-transparent py-1 text-sm transition-colors leading-7 file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>
                  {element.text}
                </div>
                <Input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setAnswers((prevAnswers: any) => ({
                      ...prevAnswers,
                      [element.id]: {
                        ...prevAnswers[element.id],
                        text: newValue,
                      },
                    }));
                  }}
                  placeholder={element.placeholder ? element.placeholder : ''}
                  key={element.id + '1'}
                  className='sm:w-1/2 leading-7 [&:not(:first-child)]:mt-0 text-muted-foreground'
                />
              </div>
            );
          } else if (element.type === 'MANY_OPTIONS') {
            return (
              <div key={element.id} className='mb-5 group relative'>
                <div className='sm:w-1/2 tracking-tight flex h-9 w-full rounded-md border-0 bg-transparent py-1 text-sm transition-colors leading-7 file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>
                  {element.text}
                </div>
                <QuestionRadioGroup
                  options={element.options}
                  setAnswers={setAnswers}
                  questionId={element.id}
                />
              </div>
            );
          }
        })}
      </div>

      <div className='mt-8'>
        <Button
          onClick={async () => {
            await submitForm(answers, form.id);
            router.push(`/forms/success/${form.id}`);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

const QuestionRadioGroup = ({
  options,
  setAnswers,
  questionId,
}: {
  options: Option[];
  setAnswers: SetAnswers;
  questionId: string;
}) => {
  return (
    <RadioGroup
      onValueChange={(value) => {
        const newValue = value;
        setAnswers((prevAnswers: any) => ({
          ...prevAnswers,
          [questionId]: {
            ...prevAnswers[questionId],
            optionId: newValue,
          },
        }));
      }}
    >
      {options.map((option: any) => {
        return (
          <div
            className='flex items-center space-x-2 relative group'
            key={option.id}
          >
            <RadioGroupItem value={option.id} id={option.id}>
              <Input
                defaultValue={option.optionText}
                placeholder='type the option here'
                className='w-1/2 border-0 shadow-none  focus-visible:ring-0 pl-0 !mt-0 !pt-0 scroll-m-20 tracking-tight transition-colors leading-7 [&:not(:first-child)]:mt-0'
              />
            </RadioGroupItem>
          </div>
        );
      })}
    </RadioGroup>
  );
};
