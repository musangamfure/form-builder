'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '../auth';
import { prisma } from '../prisma';
import { redirect } from 'next/navigation';

export const createForm = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const response = await prisma.form.create({
    data: {
      userId: session.user.id,
      title: '',
    },
  });

  return response;
};

export const updateFormFromUser = async (formId: string, title: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const response = await prisma.form.update({
    where: {
      id: formId,
      userId: session.user.id,
    },
    data: {
      title,
    },
  });

  revalidatePath(`forms/${formId}`);

  return response;
};

export const updateQuestionFromUser = async (
  formId: string,
  questionId: string,
  placeholder: string | null,
  text: string | null
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  if (text !== null && placeholder !== null) {
    const response = await prisma.question.update({
      where: {
        formId,
        id: questionId,
        userId: session.user.id,
      },
      data: {
        placeholder,
        text,
      },
    });

    revalidatePath(`forms/${formId}`);
    return response;
  } else if (text !== null) {
    const response = await prisma.question.update({
      where: {
        formId,
        id: questionId,
        userId: session.user.id,
      },
      data: {
        text,
      },
    });
    revalidatePath(`forms/${formId}`);
    return response;
  } else if (placeholder !== null) {
    const response = await prisma.question.update({
      where: {
        formId,
        id: questionId,
        userId: session.user.id,
      },
      data: {
        placeholder,
      },
    });
    revalidatePath(`forms/${formId}`);
    return response;
  } else {
    return {
      error: 'No data provided',
    };
  }
};

export const getFormsFromUser = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const response = await prisma.form.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return response;
};

export const getFormFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const response = await prisma.form.findFirst({
    where: {
      userId: session.user.id,
      id: formId,
    },
  });

  return response;
};

export const getQuestionsFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const formFromUser = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });

  if (!formFromUser) {
    return {
      error: 'Form does not exist',
    };
  }

  if (formFromUser.userId !== session.user.id) {
    return {
      error: 'Form is not yours',
    };
  }

  const response = await prisma.question.findMany({
    where: {
      formId: formFromUser.id,
      userId: session.user.id,
    },
    orderBy: {
      order: 'asc',
    },
    include: {
      options: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  revalidatePath(`forms/${formId}`);
  return response;
};

export const createOption = async (
  questionId: string,
  formId: string,
  order: number
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: 'Not authenticated' };
  }

  const question = await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
      userId: session.user.id,
      formId,
    },

    include: {
      options: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  const options = question.options;

  const updateOptionsOrder = options
    .filter((option) => {
      if (option.order >= order) {
        return true;
      }
      return false;
    })
    .map((option) => {
      const newOrder = option.order + 1;
      return prisma.option.update({
        where: {
          id: option.id,
        },
        data: {
          order: newOrder,
        },
      });
    });

  const createOrder = prisma.option.create({
    data: {
      order: order,
      optionText: `Option ${order}`,
      questionId: questionId,
    },
  });

  updateOptionsOrder.push(createOrder);

  await prisma.$transaction(updateOptionsOrder);

  revalidatePath(`forms/${formId}`);
};

export const updateOptionText = async (
  optionText: string,
  optionId: string,
  questionId: string,
  formId: string
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: 'Not authenticated' };
  }

  await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
      userId: session.user.id,
      formId,
    },
  });

  await prisma.option.update({
    where: {
      id: optionId,
    },
    data: {
      optionText,
    },
  });

  revalidatePath(`forms/${formId}`);
  return;
};

export const deleteOption = async (
  questionId: string,
  optionId: string,
  formId: string
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: 'Not authenticated' };
  }

  await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
      userId: session.user.id,
      formId,
    },
  });

  await prisma.option.delete({
    where: {
      id: optionId,
      questionId,
    },
  });
  revalidatePath(`forms/${formId}`);
};

export const deleteQuestion = async (formId: string, questionId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const formFromUser = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });
  if (!formFromUser) {
    return {
      error: 'for does not exist',
    };
  }

  const questionToDelete = await prisma.question.findFirst({
    where: {
      id: questionId,
    },
  });

  if (!questionToDelete) {
    return {
      error: 'question does not exit',
    };
  }

  if (questionToDelete.formId != formId) {
    error: 'Given question does not belong to given form';
  }

  const questions = await prisma.question.findMany({
    where: {
      formId,
      order: {
        gte: questionToDelete.order,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  const updateOperations = questions.map((question) => {
    const newOrder = question.order - 1;
    return prisma.question.update({
      where: {
        id: question.id,
        formId,
      },
      data: {
        order: newOrder,
      },
    });
  });

  const deleteFunction = prisma.question.delete({
    where: {
      id: questionId,
    },
  });
  updateOperations.push(deleteFunction);

  await prisma.$transaction(updateOperations);

  revalidatePath(`forms/${formId}`);

  return;
};

export const togglePublishFormFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const form = await prisma.form.findFirstOrThrow({
    where: {
      id: formId,
      userId: session.user.id,
    },
  });

  const response = await prisma.form.update({
    where: {
      id: formId,
      userId: session.user.id,
    },
    data: {
      published: !form.published,
    },
  });
  revalidatePath(`forms/${formId}`);

  return response;
};

export const getForm = async (formId: string) => {
  const response = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });

  if (!response) {
    redirect('/forms/e');
  }

  if (!response.published) {
    redirect('/forms/e');
  }

  return response;
};

function transform(obj: any) {
  const result = [];
  for (let key in obj) {
    if (obj[key].type === 'SHORT_RESPONSE') {
      result.push({
        answerText: obj[key].text,
        questionId: key,
        type: 'SHORT_RESPONSE',
        optionId: null,
      });
    } else if (obj[key].type === 'MANY_OPTIONS') {
      result.push({
        answerText: null,
        questionId: key,
        optionId: obj[key].optionId,
        type: 'MANY_OPTIONS',
      });
    }
  }

  return result;
}

export const submitForm = async (answersHash: string, formId: string) => {
  const answers = transform(answersHash);

  const form = await prisma.form.findFirstOrThrow({
    where: {
      id: formId,
    },
  });

  answers.map(async (answer) => {
    const question = await prisma.question.findFirstOrThrow({
      where: {
        id: answer.questionId,
      },
    });

    if (question.formId !== form.id) {
      throw new Error('');
    }

    return answer;
  });

  const response = await prisma.response.create({
    data: {
      submittedAt: new Date().toISOString(),
    },
  });

  const createAnswerOpeartions = answers.map((answer) => {
    if (answer.type === 'SHORT_RESPONSE') {
      return prisma.answer.create({
        data: {
          answerText: answer.answerText,
          questionId: answer.questionId,
          formId: form.id,
          responseId: response.id,
        },
      });
    } else if (answer.type === 'MANY_OPTIONS') {
      return prisma.answer.create({
        data: {
          answerText: '',
          questionId: answer.questionId,
          formId: form.id,
          responseId: response.id,
          optionId: answer.optionId,
        },
      });
    } else {
      throw new Error('Not valid type');
    }
  });

  await prisma.$transaction(createAnswerOpeartions);

  return;
};

export const getResponsesSumaryFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  const questions = await prisma.question.findMany({
    where: {
      formId: formId,
    },

    include: {
      answers: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          option: true,
        },
      },
    },

    orderBy: {
      order: 'asc',
    },
  });

  return questions;
};

export const checkIfUserLoggedIn = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return false;
  }

  return true;
};
