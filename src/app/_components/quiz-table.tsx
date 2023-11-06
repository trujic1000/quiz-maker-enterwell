"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Table } from "./table";
import { Quiz } from "../page";

const columns: ColumnDef<Quiz>[] = [
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
  const data = [
    {
      id: "1",
      title: "John Doe",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [
        {
          id: "1",
          title: "Who dis?",
          answer: "John Doe",
          createdAt: new Date(),
          updatedAt: new Date(),
          quizId: "1",
        },
      ],
    },
    {
      id: "2",
      title: "Jane Doe",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [],
    },
    {
      id: "3",
      title: "Mark Doe",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [],
    },
  ];

  if (data.length === 0) {
    return (
      <div>
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
        <button
          type="button"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => console.log("Button clicked")}
        >
          Create new quiz
        </button>
      </div>
      <hr className="mb-6 mt-3 h-0.5 w-full border-0 bg-gray-900" />
      <Table data={data} columns={columns} />
    </>
  );
};
