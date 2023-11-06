import { type Question, type Quiz as QuizModel } from "@prisma/client";

import { QuizTable } from "./_components/quiz-table";

export type Quiz = QuizModel & {
  questions: Question[];
};

export default async function Home() {
  return (
    <main className="text-black">
      <div className="px-14 py-10">
        <div className="container mx-auto">
          <h1 className="mb-12 text-center text-4xl font-extrabold tracking-tight sm:text-[5rem]">
            Quiz Maker
          </h1>
          <QuizTable />
        </div>
      </div>
    </main>
  );
}
