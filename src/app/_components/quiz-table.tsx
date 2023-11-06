"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import { Table } from "./table";
import { Dialog, DialogTrigger, DialogContent } from "./dialog";
import { Quiz } from "../page";

const columns: ColumnDef<Quiz>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   cell: (ctx) => ctx.getValue(),
  // },
  {
    accessorKey: "title",
    header: "Title",
    cell: (ctx) => ctx.getValue(),
  },
  {
    accessorFn: (row) => row.questions.length,
    header: "# of questions",
    cell: (ctx) => {
      const quiz = ctx.row.original;

      return <span className="font-bold">{quiz.questions.length}</span>;
    },
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Create new quiz
            </button>
          </DialogTrigger>
          <DialogContent title="Add new quiz">
            <div>Test Test</div>
          </DialogContent>
        </Dialog>
      </div>
      <hr className="mb-6 mt-3 h-0.5 w-full border-0 bg-gray-900" />
      <Table data={data} columns={columns} />
    </>
  );
};
