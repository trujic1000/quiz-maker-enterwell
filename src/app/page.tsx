import { type Question, type Quiz as QuizModel } from "@prisma/client";

import { QuizTable } from "./_components/quiz-table";

export type Quiz = QuizModel & {
  questions: Question[];
};

export default function Home() {
  return (
    <>
      <h1 className="mb-12 text-center text-4xl font-extrabold leading-normal tracking-tight sm:text-[5rem]">
        Quiz Maker
      </h1>
      <QuizTable />
    </>
  );
}
