"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Ellipsis, MoreVertical } from "lucide-react";
import { ModalDeleteBoard } from "app/components/modals/modalDeleteBoard";
import { ModalEditBoard } from "app/components/modals/modalEditBoard";
import { useBoard, useColumns } from "app/hooks/boards/useBoards";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "app/components/ui/button";
import { ModalNewTask } from "app/components/modals/modalNewTask";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);

  const params = useParams();
  const boardId = String(params.boardId);

  const { board, isLoading } = useBoard(boardId);
  const { columns } = useColumns(boardId);

  return (
    <div className="flex min-h-[calc(100%-64px)] flex-col">
      <header className="dark:bg-dark-gray border-b-lines-light dark:border-b-lines-dark hidden w-[calc(100vw-260px)] border-b bg-white md:flex">
        <div className="flex w-full items-center justify-between p-[26px]">
          <h2 className="text-2xl font-bold dark:text-white">
            {isLoading && <Ellipsis className="animate-ping" />}
            {board && board?.name}
          </h2>
          <div className="flex items-center gap-6">
            {/* Modal New Task */}
            <Dialog.Root open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <Dialog.Trigger asChild>
                <Button
                  disabled={columns?.length === 0}
                  size="lg"
                  variant="primary"
                >
                  + Add New Task
                </Button>
              </Dialog.Trigger>
              {/* Component */}
              <ModalNewTask
                open={isAddTaskOpen}
                onOpenChange={setIsAddTaskOpen}
                columns={columns}
              />
            </Dialog.Root>
            <button
              onClick={() => setIsBoardOptionsOpen(!isBoardOptionsOpen)}
              className="text-medium-gray cursor-pointer"
            >
              <MoreVertical />
            </button>
          </div>
        </div>

        {/* Board Options */}
        <div
          className={`${!isBoardOptionsOpen && "hidden"} dark:bg-dark-gray/90 absolute top-[70px] right-[38px] flex flex-col gap-4 rounded-lg bg-white/90 p-4 shadow-md`}
        >
          {/* Modal Edit Board */}
          <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <Dialog.Trigger asChild>
              <button
                onClick={() => setIsBoardOptionsOpen(!isBoardOptionsOpen)}
                className="text-medium-gray cursor-pointer text-start text-[0.8125rem] font-bold"
              >
                Edit Board
              </button>
            </Dialog.Trigger>
            {/* Component */}
            <ModalEditBoard
              board={board}
              columns={columns}
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
            />
          </Dialog.Root>

          {/* Modal Delete Board */}
          <Dialog.Root
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          >
            <Dialog.Trigger asChild>
              <button
                onClick={() => setIsBoardOptionsOpen(!isBoardOptionsOpen)}
                className="text-red cursor-pointer text-start text-[0.8125rem] font-bold"
              >
                Delete Board
              </button>
            </Dialog.Trigger>
            {/* Component */}
            <ModalDeleteBoard
              board={board}
              onOpenChange={setIsDeleteModalOpen}
            />
          </Dialog.Root>
        </div>
      </header>

      <main className="scrollbar-custom dark:scrollbar-custom-dark h-[calc(100svh-64px)] overflow-hidden md:max-h-[calc(100vh-100px)] md:max-w-[calc(100vw-260px)]">
        {children}
      </main>
    </div>
  );
}
