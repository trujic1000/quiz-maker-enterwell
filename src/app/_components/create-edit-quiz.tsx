"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "~/trpc/react";
import { Dialog, DialogTrigger, DialogContent } from "./dialog";
import { Input } from "./input";
import { type Quiz } from "../page";
import { CheckboxGroup } from "./checkbox-group";

const DIALOG_STEP = {
  EDIT_QUIZ: "EDIT_QUIZ",
  INSERT_QUESTIONS: "INSERT_QUESTIONS",
};

const DEFAULT_FORM = {
  title: "",
  questions: [
    { title: "", answer: "" },
    { title: "", answer: "" },
    { title: "", answer: "" },
    { title: "", answer: "" },
    { title: "", answer: "" },
  ],
};

const createQuizSchema = z.object({
  title: z.string().min(1, { message: "This field is required" }),
  questions: z.array(
    z.object({
      title: z.string().min(1, { message: "This field is required" }),
      answer: z.string().min(1, { message: "This field is required" }),
    }),
  ),
});

type FormValues = z.infer<typeof createQuizSchema>;

type CreateOrEditQuizProps = {
  quiz?: Quiz;
};

export function CreateOrEditQuiz({ quiz }: CreateOrEditQuizProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogStep, setDialogStep] = React.useState(DIALOG_STEP.EDIT_QUIZ);
  const [selectedQuestionIds, setSelectedQuestionIds] = React.useState<
    string[]
  >([]);
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createQuizSchema),
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: "questions",
  });
  const utils = api.useUtils();

  React.useEffect(() => {
    reset(quiz ? quiz : DEFAULT_FORM);
  }, [quiz, reset]);

  const { data: allQuestions } = api.quiz.getQuestions.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const checkboxesOptions = allQuestions
    ?.filter(
      (question) => !quiz?.questions.find((q) => q.title === question.title),
    )
    .map((question) => ({
      label: question.title,
      value: question.id,
    }));

  const insertQuestions = () => {
    const questionMap = new Map(allQuestions?.map((q) => [q.id, q]));

    const filteredQuestions = selectedQuestionIds.map((id) =>
      questionMap.get(id),
    );

    const questionsToInsert = filteredQuestions.map((question) => ({
      title: question?.title ?? "",
      answer: question?.answer ?? "",
    }));

    append(questionsToInsert);
    setSelectedQuestionIds([]);
    setDialogStep(DIALOG_STEP.EDIT_QUIZ);
  };

  const createQuiz = api.quiz.create.useMutation({
    onSuccess: () => {
      console.log("Quiz successfully created!");
      setDialogOpen(false);
      reset(DEFAULT_FORM);
      void utils.quiz.getAll.refetch();
      void utils.quiz.getQuestions.refetch();
    },
    onError: (error) =>
      console.error(
        `Failed to create the quiz. Error message: ${error.message}`,
      ),
  });

  const editQuiz = api.quiz.update.useMutation({
    onSuccess: () => {
      console.log("Quiz successfully updated!");
      setDialogOpen(false);
      reset(quiz);
      void utils.quiz.getAll.refetch();
      void utils.quiz.getQuestions.refetch();
    },
    onError: (error) =>
      console.error(
        `Failed to create the quiz. Error message: ${error.message}`,
      ),
  });

  const onSubmit = handleSubmit(({ title, questions }) => {
    quiz
      ? editQuiz.mutate({ id: quiz.id, title, questions })
      : createQuiz.mutate({ title, questions });
  });

  const isLoading = createQuiz.isLoading || editQuiz.isLoading;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button type="button" className="btn btn-primary">
          {quiz ? "Edit" : "Create new quiz"}
        </button>
      </DialogTrigger>
      {dialogStep === DIALOG_STEP.EDIT_QUIZ && (
        <DialogContent
          title="Add new quiz"
          onClose={() => reset(quiz ? quiz : DEFAULT_FORM)}
          className="w-[42rem]"
        >
          <form className="grid bg-white p-10 text-black" onSubmit={onSubmit}>
            <div>
              <Input
                register={register}
                name="title"
                label="Quiz title"
                placeholder="Enter quiz title"
                required
                error={errors.title}
              />
              <hr className="mb-6 mt-3 h-0.5 w-full border-0 bg-gray-900" />
            </div>
            <div className="-mr-10 max-h-[30rem] overflow-y-auto pr-10">
              {fields.map((question, index) => (
                <div
                  key={question.id}
                  className="relative flex flex-col items-center gap-6 py-2 lg:flex-row"
                >
                  <Input
                    register={register}
                    name={`questions.${index}.title`}
                    label={`${index + 1}. Question`}
                    placeholder="Enter question title"
                    fieldsetClassName="flex-1"
                    required
                    error={errors.questions?.[index]?.title}
                  />
                  <Input
                    register={register}
                    name={`questions.${index}.answer`}
                    label="Answer"
                    placeholder="Enter answer"
                    fieldsetClassName="flex-1"
                    required
                    error={errors.questions?.[index]?.answer}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-4 lg:relative lg:top-0 lg:pt-8"
                    onClick={() => {
                      if (fields.length > 1) {
                        remove(index);
                      }
                    }}
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18"
                        stroke="#000"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 6L18 18"
                        stroke="#000"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mt-4"
                onClick={() => append({ title: "", answer: "" })}
              >
                Add new
              </button>
              <button
                type="button"
                className="btn btn-secondary ml-4 mt-4"
                onClick={() => setDialogStep(DIALOG_STEP.INSERT_QUESTIONS)}
              >
                Insert Questions
              </button>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </DialogContent>
      )}
      {dialogStep === DIALOG_STEP.INSERT_QUESTIONS && (
        <DialogContent
          title="Insert questions"
          onClose={() => {
            reset(quiz ? quiz : DEFAULT_FORM);
            setDialogStep(DIALOG_STEP.EDIT_QUIZ);
          }}
          className="w-[36rem]"
        >
          <div className="grid gap-10 bg-white p-10 text-black">
            {!!checkboxesOptions?.length ? (
              <CheckboxGroup
                control={control}
                name="selectedQuestionIds"
                label="All questions"
                options={checkboxesOptions || []}
                className="-mr-10 max-h-[23rem] overflow-y-auto pr-10"
                onChange={(selectedQuestionIds) =>
                  setSelectedQuestionIds(selectedQuestionIds)
                }
              />
            ) : (
              <p>No questions to insert</p>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedQuestionIds([]);
                  setDialogStep(DIALOG_STEP.EDIT_QUIZ);
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={insertQuestions}
                disabled={!checkboxesOptions?.length}
              >
                Insert
              </button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
