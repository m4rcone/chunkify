"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { ModalDeleteBoard } from "app/components/modals/modal-delete-board";
import { ModalEditBoard } from "app/components/modals/modal-edit-board";
import { useBoard, useColumns } from "app/hooks/boards/useBoards";
import * as Dialog from "@radix-ui/react-dialog";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const params = useParams();
  const boardId = String(params.boardId);

  const { board, isLoading } = useBoard(boardId);
  const { columns } = useColumns(boardId);

  return (
    <div className="flex min-h-[calc(100%-64px)] flex-col">
      <header className="dark:bg-dark-gray border-b-lines-light dark:border-b-lines-dark hidden w-[calc(100vw-260px)] border-b bg-white md:flex">
        <div className="flex w-full items-center justify-between p-[26px]">
          <h2 className="text-2xl font-bold dark:text-white">
            {isLoading && "..."}
            {board && board?.name}
          </h2>
          <div className="flex items-center gap-6">
            <button
              disabled={true}
              className="disabled:bg-main-purple-hover bg-main-purple hover:bg-main-purple-hover cursor-pointer rounded-3xl px-5 py-3.5 text-sm font-bold text-white"
            >
              + Add New Task
            </button>
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
          className={`${!isBoardOptionsOpen && "hidden"} dark:bg-dark-gray absolute top-[126px] right-[26px] flex w-[192px] flex-col gap-4 rounded-lg bg-white p-4 shadow-md`}
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
            {/* ModalEditBoard Component */}
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
            {/* ModalDeleteBoard Component */}
            <ModalDeleteBoard
              board={board}
              onOpenChange={setIsDeleteModalOpen}
            />
          </Dialog.Root>
        </div>
      </header>

      <main className="h-[calc(100vh-64px)] overflow-hidden md:max-h-[calc(100vh-100px)] md:max-w-[calc(100vw-260px)]">
        {children}
      </main>
    </div>
  );
}
