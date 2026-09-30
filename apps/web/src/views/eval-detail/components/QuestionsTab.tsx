"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { EvalQuestion } from "@docmind/shared";

import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getErrorMessage } from "@/lib/axios";
import { useDocuments } from "@/queries/documents.queries";
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
  const form = useForm<CreateEvalQuestionInput>({
    resolver: zodResolver(createEvalQuestionSchema),
    defaultValues: {
      question: "",
      expectedAnswer: "",
      expectedDocumentId: ANY_DOCUMENT,
    },
  });
  const [question, expectedAnswer] = form.watch(["question", "expectedAnswer"]);
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
                      <SelectItem key={d.id} value={d.id}>
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

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[13px] text-muted-foreground">
          Each question is answered by the pipeline, then graded by the judge
          against the expected answer.
        </span>
        {!adding && (
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

      <div className="mt-3 overflow-hidden rounded-xl border">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[34%]">Question</TableHead>
              <TableHead>Expected answer</TableHead>
              <TableHead className="w-[230px]">Expected document</TableHead>
              <TableHead className="w-[52px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-muted-foreground"
                >
                  No questions yet. Add one to run your first eval.
                </TableCell>
              </TableRow>
            )}
            {questions.map((q) => (
              <TableRow key={q.id} className="animate-dmin">
                <TableCell className="leading-[1.45] font-medium whitespace-normal">
                  {q.question}
                </TableCell>
                <TableCell className="max-w-0 text-fg2">
                  <span className="block truncate">{q.expectedAnswer}</span>
                </TableCell>
                <TableCell className="max-w-[230px] truncate font-mono text-xs text-muted-foreground">
                  {q.expectedDocumentTitle ?? "—"}
                </TableCell>
                <TableCell className="px-2.5 py-2 text-right">
                  <button
                    aria-label="Delete question"
                    onClick={() =>
                      remove.mutate(q.id, {
                        onSuccess: () =>
                          toast.success("Question deleted", {
                            description:
                              "It will be excluded from future runs.",
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
