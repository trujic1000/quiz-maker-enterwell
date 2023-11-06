"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { api } from "~/trpc/react";
import { Dialog, DialogTrigger, DialogContent } from "./dialog";
import { Input } from "./input";

type Question = {
  title: string;
  answer: string;
};

type FormValues = {
  title: string;
  // questions: Question[];
};

export function CreateQuiz() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { control, watch, handleSubmit, reset, register } =
    useForm<FormValues>();
  // const { append, fields, remove } = useFieldArray({ control, name: "questions" });

  const createQuiz = api.quiz.create.useMutation({
    onSuccess: () => {
      console.log("Success!!");
    },
  });

  const onSubmit = handleSubmit(({ title }) => {
    createQuiz.mutate({ title });
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Create new quiz
        </button>
      </DialogTrigger>
      <DialogContent title="Add new quiz">
        <form
          className="grid gap-10 bg-white p-10 text-black"
          onSubmit={onSubmit}
        >
          <Input
            register={register}
            name="title"
            label="Quiz title"
            placeholder="Enter quiz title"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            disabled={createQuiz.isLoading}
          >
            {createQuiz.isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
