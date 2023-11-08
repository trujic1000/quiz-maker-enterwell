"use client";
import React from "react";
import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react";
import { type Quiz } from "../page";

type QuizPreviewProps = {
  quiz: Quiz;
};

export const QuizPreview = ({ quiz }: QuizPreviewProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setCurrentQuestionIndex(emblaApi.selectedScrollSnap);
  }, []);

  const removeOnSelectListener = React.useCallback(() => {
    if (emblaApi) emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", onSelect);
    }
    return removeOnSelectListener;
  }, [emblaApi]);

  return (
    <>
      <div
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-r from-gray-700 via-gray-900 to-black py-10 text-center text-white shadow-sm"
        ref={emblaRef}
      >
        <div className="flex">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="relative min-w-0 flex-[0_0_100%] px-10"
            >
              <span className="absolute right-10 top-0 grid h-10 w-10 place-items-center rounded-full bg-white text-black">
                {index + 1}
              </span>
              <p className="text-xl font-bold">Question:</p>
              <p>{question.title}</p>
              <p className="mt-4 text-xl font-bold">Answer:</p>
              <p>{showAnswer ? question.answer : "**********"}</p>
              <button
                type="button"
                className="mt-4"
                onClick={() => setShowAnswer((showAnswer) => !showAnswer)}
              >
                {showAnswer ? "Hide" : "Show"} answer
              </button>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center">
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </p>
    </>
  );
};
