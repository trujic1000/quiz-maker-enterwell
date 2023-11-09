"use client";
import React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import { Table } from "./table";
import { CreateOrEditQuiz } from "./create-edit-quiz";
import { type Quiz } from "../page";
import { DeleteQuizDialog } from "./delete-quiz";
import Link from "next/link";

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
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-4">
        <Link href={`/quiz/${row.original.id}`} className="btn btn-secondary">
          Preview
        </Link>
        <CreateOrEditQuiz quiz={row.original} />
        <DeleteQuizDialog id={row.original.id} />
      </div>
    ),
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
        <CreateOrEditQuiz />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">All Quizzes</h2>
        <CreateOrEditQuiz />
      </div>
      <hr className="mb-6 mt-3 h-0.5 w-full border-0 bg-gray-900" />
      <Table data={data} columns={columns} />
    </div>
  );
};
