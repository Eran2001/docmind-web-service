"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { EvalQuestion, RatedAnswer } from "@/types";

import { DataGrid, type DataGridColumn } from "@/components/common/DataGrid";
import { Spinner } from "@/components/common/Spinner";
import { TruncatedText } from "@/components/common/TruncatedText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/api/errors";
import { useDemo } from "@/queries/auth.queries";
import { useDocuments } from "@/queries/documents.queries";
import { useDownRatedAnswers } from "@/queries/feedback.queries";
import {
  useAddEvalQuestion,
  useDeleteEvalQuestion,
} from "@/queries/evals.queries";
import {
  createEvalQuestionSchema,
  type CreateEvalQuestionInput,
} from "@/schemas/eval.schema";

const ANY_DOCUMENT = "any";

function AddQuestionForm({
  setId,
  collectionId,
  onDone,
}: {
  setId: string;
  collectionId: string;
  onDone: () => void;
}) {
  const add = useAddEvalQuestion(setId);
  const documents = useDocuments(collectionId);
  const rated = useDownRatedAnswers(collectionId);
  // The answer the question was taken from, shown so the expected answer can be written against it.
  const [source, setSource] = useState<RatedAnswer | null>(null);
  const form = useForm<CreateEvalQuestionInput>({
    resolver: zodResolver(createEvalQuestionSchema),
    defaultValues: {
      question: "",
      expectedAnswer: "",
      expectedDocumentId: ANY_DOCUMENT,
    },
  });
  const [question, expectedAnswer] = useWatch({
    control: form.control,
    name: ["question", "expectedAnswer"],
  });
  const disabled = !question.trim() || !expectedAnswer.trim() || add.isPending;

  const submit = form.handleSubmit((values) =>
    add.mutate(
      {
        ...values,
        expectedDocumentId:
          values.expectedDocumentId === ANY_DOCUMENT
            ? undefined
            : values.expectedDocumentId,
      },
      {
        onSuccess: () => {
          form.reset({
            question: "",
            expectedAnswer: "",
            expectedDocumentId: values.expectedDocumentId,
          });
          onDone();
        },
        onError: (err) =>
          toast.error("Something went wrong", {
            description: getErrorMessage(err),
          }),
      },
    ),
  );

  return (
    <form
      onSubmit={submit}
      className="mt-3 flex animate-dmin flex-col gap-3 rounded-xl border p-4"
    >
      {rated.data && rated.data.length > 0 && (
        <div className="flex flex-col gap-2">
          <Select
            value={source?.resourceId ?? ""}
            onValueChange={(id) => {
              const item = rated.data?.find((r) => r.resourceId === id);
              if (!item) return;
              setSource(item);
              form.setValue("question", item.question, { shouldDirty: true });
            }}
          >
            <SelectTrigger
              className="w-full"
              aria-label="Start from an answer you rated down"
            >
              <SelectValue
                placeholder={`Start from an answer you rated down (${rated.data.length})`}
              />
            </SelectTrigger>
            <SelectContent>
              {rated.data.map((r) => (
                <SelectItem key={r.resourceId} value={r.resourceId}>
                  <span className="block max-w-[60ch] truncate">
                    {r.question}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {source && (
            <div className="rounded-lg bg-secondary px-3.5 py-3 text-[13px] leading-[1.55]">
              <div className="mb-1 text-xs font-medium text-faint">
                The answer you rated down
                {source.comment ? ` · your note: “${source.comment}”` : ""}
              </div>
              <p className="m-0 line-clamp-5 wrap-anywhere whitespace-pre-wrap text-fg2">
                {source.answer}
              </p>
              <p className="mt-2 mb-0 text-xs text-muted-foreground">
                Write the answer it should have given below.
              </p>
            </div>
          )}
        </div>
      )}
      <Input
        autoFocus
        placeholder="Question"
        aria-label="Question"
        {...form.register("question")}
      />
      <Input
        placeholder="Expected answer"
        aria-label="Expected answer"
        {...form.register("expectedAnswer")}
      />
      <div className="flex flex-wrap gap-2">
        <div className="min-w-[220px] flex-1">
          <Controller
            control={form.control}
            name="expectedDocumentId"
            render={({ field }) => (
              <Select
                value={field.value ?? ANY_DOCUMENT}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  className="w-full"
                  aria-label="Expected document"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY_DOCUMENT}>Any document</SelectItem>
                  {documents.data
                    ?.filter((d) => d.status === "ready")
                    .map((d) => (
                      <SelectItem key={d.resourceId} value={d.resourceId}>
                        {d.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <Button type="button" variant="outline" size="lg" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={disabled}>
          {add.isPending && <Spinner />}
          Add question
        </Button>
      </div>
    </form>
  );
}

interface Props {
  setId: string;
  collectionId: string;
  questions: EvalQuestion[];
}

export function QuestionsTab({ setId, collectionId, questions }: Props) {
  const [adding, setAdding] = useState(false);
  const remove = useDeleteEvalQuestion(setId);
  const demo = useDemo(); // demo visitors can read the sample questions, not change them

  const columns: DataGridColumn<EvalQuestion>[] = [
    {
      key: "question",
      header: "Question",
      primary: true,
      headClassName: "w-[34%]",
      cellClassName: "whitespace-normal",
      cell: (q) => (
        <span className="leading-[1.45] font-medium">{q.question}</span>
      ),
    },
    {
      key: "expected",
      header: "Expected answer",
      wide: true,
      cellClassName: "max-w-0 text-fg2",
      cell: (q) => <TruncatedText lines={2}>{q.expectedAnswer}</TruncatedText>,
    },
    {
      key: "document",
      header: "Expected document",
      wide: true,
      headClassName: "w-[230px]",
      cellClassName: "max-w-[230px] font-mono text-xs text-muted-foreground",
      cell: (q) => (
        <TruncatedText>{q.expectedDocumentTitle ?? "—"}</TruncatedText>
      ),
    },
    {
      key: "delete",
      header: "",
      corner: true,
      headClassName: "w-[52px]",
      cellClassName: "px-2.5 py-2 text-right",
      cell: (q) =>
        demo ? null : (
          <button
            aria-label="Delete question"
            onClick={() =>
              remove.mutate(q.id, {
                onSuccess: () =>
                  toast.success("Question deleted", {
                    description: "It will be excluded from future runs.",
                  }),
                onError: (err) =>
                  toast.error("Something went wrong", {
                    description: getErrorMessage(err),
                  }),
              })
            }
            className="grid size-[30px] place-items-center rounded-full text-muted-foreground hover:bg-err-bg hover:text-destructive"
          >
            <Trash2 className="size-[15px]" />
          </button>
        ),
    },
  ];

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[13px] text-muted-foreground">
          Each question is answered by the pipeline, then graded by the judge
          against the expected answer.
        </span>
        {!adding && !demo && (
          <Button
            variant="outline"
            onClick={() => setAdding(true)}
            className="flex-none"
          >
            <Plus />
            Add question
          </Button>
        )}
      </div>
      {adding && (
        <AddQuestionForm
          setId={setId}
          collectionId={collectionId}
          onDone={() => setAdding(false)}
        />
      )}

      <div className="mt-3">
        <DataGrid
          columns={columns}
          rows={questions}
          rowKey={(q) => q.id}
          tableClassName="min-w-[760px]"
          empty={
            <div className="py-12 text-center text-muted-foreground">
              No questions yet. Add one to run your first eval.
            </div>
          }
        />
      </div>
    </>
  );
}
