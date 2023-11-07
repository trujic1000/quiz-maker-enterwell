"use client";
import React from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import { Table } from "./table";
import { CreateQuiz } from "./create-quiz";
import { type Quiz } from "../page";
import { Alert, AlertContent, AlertTrigger } from "./alert";

const columns: ColumnDef<Quiz>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: (ctx) => ctx.getValue(),
  },
  {
    accessorFn: (row) => row.questions.length,
    header: "# Of Questions",
    cell: (ctx) => ctx.row.original.questions.length,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <QuizTableActionRow row={row} />,
  },
];

export const QuizTable = () => {
  const { data, isLoading, error } = api.quiz.getAll.useQuery();

  if (error) {
    console.error(`Something went wrong. Error message: ${error.message}`);
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center">
        <p>No quizes available</p>
        <button
          type="button"
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => console.log("Button clicked")}
        >
          Create new quiz
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">All Quizzes</h2>
        <CreateQuiz />
      </div>
      <hr className="mb-6 mt-3 h-0.5 w-full border-0 bg-gray-900" />
      <Table data={data} columns={columns} />
    </>
  );
};

type QuizTableActionRowProps = {
  row: Row<Quiz>;
};

const QuizTableActionRow = ({ row }: QuizTableActionRowProps) => {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const utils = api.useUtils();

  const deleteQuizMutation = api.quiz.softDelete.useMutation({
    onSuccess: () => {
      console.log("Quiz successfully deleted");
      setAlertOpen(false);
      utils.quiz.getAll.refetch();
    },
    onError: (error) =>
      console.error(
        `Failed to delete the quiz. Error message: ${error.message}`,
      ),
  });

  return (
    <Alert open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertTrigger className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Delete
      </AlertTrigger>
      <AlertContent
        title="Delete quiz"
        onCancel={() => setAlertOpen(false)}
        confirmText="Delete"
        onConfirm={() => deleteQuizMutation.mutate({ id: row.original.id })}
        isLoading={deleteQuizMutation.isLoading}
      >
        <span className="text-neutral-10 mb-2 block text-[1.375rem] font-bold leading-normal">
          Wait a minute!
        </span>
        <p className="font-inter text-neutral-8 font-semibold leading-loose">
          Are you sure you want to delete this quiz?
        </p>
      </AlertContent>
    </Alert>
  );
};
