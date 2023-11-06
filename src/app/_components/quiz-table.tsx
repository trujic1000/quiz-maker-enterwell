"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Table } from "./table";
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
    id: "numOfQuestions",
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
      questions: [],
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

  return <Table data={data} columns={columns} />;
};
