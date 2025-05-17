"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ModalEditBoard } from "app/components/modals/modalEditBoard";
import { ModalTask } from "app/components/modals/modalTask";
import { Button } from "app/components/ui/button";
import { useBoard, useColumns } from "app/hooks/boards/useBoards";
import { useSubtasks, useTasks } from "app/hooks/tasks/useTasks";
import { Column } from "app/services/boardService";
import { Task } from "app/services/taskService";
import { Ellipsis } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function BoardPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const params = useParams();
  const boardId = String(params.boardId);

  const { board } = useBoard(boardId);
  const { columns, isLoading, error } = useColumns(boardId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Ellipsis className="text-medium-gray animate-ping" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-medium-gray text-lg font-bold">
          Error fetching columns.
        </p>
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-4">
        <p className="text-medium-gray text-center text-lg font-bold">
          This board is empty. Create a new column to get started.
        </p>
        {/* Modal Edit Board */}
        <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <Dialog.Trigger asChild>
            <div className="max-w-[174px]">
              <Button size="lg" variant="primary">
                + Add New Column
              </Button>
            </div>
          </Dialog.Trigger>
          {/* Component */}
          <ModalEditBoard
            board={board}
            columns={columns}
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
          />
        </Dialog.Root>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto overflow-y-auto px-4 py-6 md:px-6">
      <div className="flex gap-6">
        {columns.map((column) => (
          <ColumnItem key={column.id} column={column} />
        ))}
        {columns.length < 6 && (
          <div className="bg-lines-light/50 dark:bg-dark-gray/25 mt-10 hidden h-[calc(100vh-200px)] min-w-[280px] items-center justify-center rounded-lg shadow-md md:flex">
            {/* Modal Edit Board */}
            <Dialog.Root
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
            >
              <Dialog.Trigger asChild>
                <p className="text-medium-gray hover:text-main-purple cursor-pointer text-lg font-bold">
                  + New Column
                </p>
              </Dialog.Trigger>
              {/* Component */}
              <ModalEditBoard
                board={board}
                columns={columns}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
              />
            </Dialog.Root>
          </div>
        )}
      </div>
    </div>
  );
}

function ColumnItem({ column }: { column: Column }) {
  const { tasks, isLoading } = useTasks(column.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-medium-gray text-xs font-bold tracking-[2.4px]">
        {`🟣 ${column.name.toUpperCase()} (${isLoading ? "0" : tasks.length})`}
      </h1>
      <TasksList tasks={tasks} isLoading={isLoading} />
    </div>
  );
}

function TasksList({
  tasks,
  isLoading,
}: {
  tasks: Task[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="border-lines-light/80 dark:border-lines-dark/20 flex h-[calc(100svh-160px)] w-[280px] flex-col items-center justify-center rounded-lg border md:max-h-[calc(100vh-200px)]">
        <Ellipsis
          width={19.5}
          height={19.5}
          className="text-medium-gray animate-ping"
        />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="border-lines-light/80 dark:border-lines-dark/20 flex h-[calc(100svh-160px)] w-[280px] flex-col items-center justify-center rounded-lg border md:max-h-[calc(100vh-200px)]">
        <h2 className="text-medium-gray/20 text-[0.9375rem] font-bold">
          Empty
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {!isLoading &&
        tasks.map((task) => <TaskItem key={task.id} task={task} />)}
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const params = useParams();
  const boardId = String(params.boardId);

  const [isModalTaskOpen, setIsModalTaskOpen] = useState<boolean>(false);

  return (
    <Dialog.Root open={isModalTaskOpen} onOpenChange={setIsModalTaskOpen}>
      <Dialog.Trigger asChild>
        <div
          key={task.id}
          className="dark:bg-dark-gray group flex w-[280px] cursor-pointer flex-col gap-2 rounded-lg bg-white px-4 py-6 shadow-md"
        >
          <h2 className="group-hover:text-main-purple text-[0.9375rem] font-bold break-all text-black dark:text-white">
            {task.title}
          </h2>
          <SubtasksInfo taskId={task.id} />
        </div>
      </Dialog.Trigger>
      {/* Component */}
      <ModalTask
        task={task}
        boardId={boardId}
        open={isModalTaskOpen}
        onOpenChange={setIsModalTaskOpen}
      />
    </Dialog.Root>
  );
}

function SubtasksInfo({ taskId }: { taskId: string }) {
  const { subtasks, isLoading } = useSubtasks(taskId);

  const subtasksCompleted = subtasks?.filter(
    (subtask) => subtask.is_completed === true,
  );

  return (
    <p className="text-medium-gray text-xs font-bold">
      {isLoading && (
        <Ellipsis width={16} height={16} className="animate-ping" />
      )}
      {!isLoading &&
        `${subtasksCompleted?.length} of ${subtasks?.length} subtasks`}
    </p>
  );
}
