"use client";
import React from "react";

import { api } from "~/trpc/react";
import { Alert, AlertContent, AlertTrigger } from "./alert";

type DeleteQuizDialogProps = {
  id: string;
};

export const DeleteQuizDialog = ({ id }: DeleteQuizDialogProps) => {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const utils = api.useUtils();

  const deleteQuizMutation = api.quiz.softDelete.useMutation({
    onSuccess: () => {
      console.log("Quiz successfully deleted");
      setAlertOpen(false);
      utils.quiz.getAll.refetch();
    },
    onError: (error) =>
      console.error(
        `Failed to delete the quiz. Error message: ${error.message}`,
      ),
  });

  return (
    <Alert open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertTrigger className="btn btn-primary">Delete</AlertTrigger>
      <AlertContent
        title="Delete quiz"
        onCancel={() => setAlertOpen(false)}
        confirmText="Delete"
        onConfirm={() => deleteQuizMutation.mutate({ id })}
        isLoading={deleteQuizMutation.isLoading}
      >
        <span className="text-neutral-10 mb-2 block text-[1.375rem] font-bold leading-normal">
          Wait a minute!
        </span>
        <p className="font-inter text-neutral-8 font-semibold leading-loose">
          Are you sure you want to delete this quiz?
        </p>
      </AlertContent>
    </Alert>
  );
};
