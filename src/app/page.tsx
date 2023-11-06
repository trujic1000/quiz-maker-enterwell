import Link from "next/link";
import { type Question, type Quiz as QuizModel } from "@prisma/client";

import { CreateQuiz } from "~/app/_components/create-quiz";
import { QuizTable } from "./_components/quiz-table";

export type Quiz = QuizModel & {
  questions: Question[];
};

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Quiz Maker
        </h1>
        {/* <CrudShowcase /> */}
        <QuizTable />
      </div>
    </main>
  );
}

// async function CrudShowcase() {
//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreateQuiz />
//     </div>
//   );
// }
