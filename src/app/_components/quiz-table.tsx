"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import { Table } from "./table";
import { CreateQuiz } from "./create-quiz";
import { Quiz } from "../page";

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
];

export const QuizTable = () => {
  const { data, isLoading, error } = api.quiz.getAll.useQuery();
  const [dialogOpen, setDialogOpen] = React.useState(false);

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
