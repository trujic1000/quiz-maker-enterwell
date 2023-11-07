"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "~/trpc/react";
import { Dialog, DialogTrigger, DialogContent } from "./dialog";
import { Input } from "./input";
import { type Quiz } from "../page";

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
  }, [quiz]);

  const createQuiz = api.quiz.create.useMutation({
    onSuccess: () => {
      console.log("Quiz successfully created!");
      setDialogOpen(false);
      reset(DEFAULT_FORM);
      utils.quiz.getAll.refetch();
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
      utils.quiz.getAll.refetch();
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
        <button
          type="button"
          className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          {quiz ? "Edit" : "Create new quiz"}
        </button>
      </DialogTrigger>
      <DialogContent
        title="Add new quiz"
        onClose={() => reset(quiz ? quiz : DEFAULT_FORM)}
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
              className="mt-2 rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={() => append({ title: "", answer: "" })}
            >
              Add new question
            </button>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
