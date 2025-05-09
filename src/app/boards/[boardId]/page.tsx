"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ModalEditBoard } from "app/components/modals/modal-edit-board";
import { Button } from "app/components/ui/button";
import { useBoard, useBoardActions } from "app/hooks/boards/useBoards";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function BoardPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const params = useParams();
  const boardId = String(params.boardId);
  const { board } = useBoard(boardId);
  const { getColumns } = useBoardActions();
  const { columns, isLoading, error } = getColumns(boardId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-medium-gray text-lg font-bold">Loading...</p>
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
          {/* ModalEditBoard Component */}
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
          <div key={column.id} className="flex flex-col gap-6">
            <h1 className="text-medium-gray text-xs font-bold tracking-[2.4px]">
              {`🟣 ${column.name.toUpperCase()} (3)`}
            </h1>
            <div className="flex flex-col gap-5">
              <div className="dark:bg-dark-gray group flex w-[280px] cursor-pointer flex-col gap-2 rounded-lg bg-white px-4 py-6 shadow-md">
                <h2 className="group-hover:text-main-purple text-[0.9375rem] font-bold text-black dark:text-white">
                  Task title
                </h2>
                <p className="text-medium-gray text-xs font-bold">
                  0 of 2 subtasks
                </p>
              </div>
              <div className="group dark:bg-dark-gray flex w-[280px] cursor-pointer flex-col gap-2 rounded-lg bg-white px-4 py-6 shadow-md">
                <h2 className="group-hover:text-main-purple text-[0.9375rem] font-bold text-black dark:text-white">
                  Task title
                </h2>
                <p className="text-medium-gray text-xs font-bold">
                  0 of 2 subtasks
                </p>
              </div>
              <div className="group dark:bg-dark-gray flex w-[280px] cursor-pointer flex-col gap-2 rounded-lg bg-white px-4 py-6 shadow-md">
                <h2 className="group-hover:text-main-purple text-[0.9375rem] font-bold text-black dark:text-white">
                  Task title
                </h2>
                <p className="text-medium-gray text-xs font-bold">
                  0 of 2 subtasks
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-lines-light/50 dark:bg-dark-gray/25 mt-10 hidden min-w-[280px] items-center justify-center rounded-lg shadow-md md:flex">
          <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <Dialog.Trigger asChild>
              <p className="text-medium-gray hover:text-main-purple cursor-pointer text-lg font-bold">
                + New Column
              </p>
            </Dialog.Trigger>
            {/* ModalEditBoard Component */}
            <ModalEditBoard
              board={board}
              columns={columns}
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
            />
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
}
