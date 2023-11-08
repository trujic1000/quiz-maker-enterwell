"use client";
import React from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { QuizPreview } from "~/app/_components/quiz-preview";

export default function QuizPage() {
  const params = useParams();
  const { id } = params;

  const { data, isLoading, error } = api.quiz.getById.useQuery({
    id: id as string,
  });

  if (error) {
    console.error(`Something went wrong. Error message: ${error.message}`);
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <>
      <h1 className="mb-12 text-center text-4xl font-extrabold leading-normal tracking-tight sm:text-[5rem]">
        {data.title}
      </h1>
      <QuizPreview quiz={data} />
    </>
  );
}
