import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useParams } from "next/navigation";
import { BoardList } from "./board-list";
import { DarkModeToggle } from "./dark-mode-toggle";
import { ChevronDown, MoreVertical, Plus, SquareKanban } from "lucide-react";
import { Board } from "app/services/boardService";
import { ModalNewBoard } from "../modals/modal-new-board";
import { useState } from "react";
import { ModalEditBoard } from "../modals/modal-edit-board";
import { useColumns } from "app/hooks/boards/useBoards";
import { ModalDeleteBoard } from "../modals/modal-delete-board";

export function MobileNavigation({ boards }: { boards: Board[] }) {
  const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const params = useParams();
  const boardId = String(params.boardId);
  const boardsQtd = boards ? boards.length : 0;
  const currentBoard = boards?.find((board) => board.id === boardId);
  const { columns } = useColumns(boardId);

  return (
    <header className="dark:bg-dark-gray border-b-lines-light dark:border-b-lines-dark w-full border-b bg-white md:hidden">
      <div className="flex items-center justify-between p-4">
        {/* Logo and title */}
        <div className="flex items-center gap-4">
          <Link href={"/"}>
            <Image
              src="logo.svg"
              alt=""
              width={24}
              height={25}
              className="h-auto"
            />
          </Link>
          <span className="flex items-center gap-2">
            <h1 className="max-w-[160px] truncate text-lg font-bold text-black dark:text-white">
              {currentBoard ? currentBoard.name : "Chunkify"}
            </h1>
            {/* Modal Menu */}
            <ModalMenu boards={boards} boardsQtd={boardsQtd} />
          </span>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            disabled
            className="bg-main-purple disabled:bg-main-purple-hover hover:bg-main-purple-hover cursor-pointer rounded-3xl px-3 py-1 text-white"
          >
            <Plus />
          </button>
          <button
            disabled={!currentBoard && true}
            onClick={() => setIsBoardOptionsOpen(!isBoardOptionsOpen)}
            className="text-medium-gray cursor-pointer"
          >
            <MoreVertical />
          </button>
        </div>
      </div>

      {/* Board Options */}
      <div
        className={`${!isBoardOptionsOpen && "hidden"} dark:bg-dark-gray absolute top-[80px] right-[16px] flex w-[192px] flex-col gap-4 rounded-lg bg-white p-4 shadow-md`}
      >
        {/* Modal Edit Board */}
        <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <Dialog.Trigger asChild>
            <p
              onClick={() => setIsBoardOptionsOpen(!isBoardOptionsOpen)}
              className="text-medium-gray cursor-pointer text-[0.8125rem] font-bold"
            >
              Edit Board
            </p>
          </Dialog.Trigger>
          {/* ModalEditBoard Component */}
          <ModalEditBoard
            board={currentBoard}
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
            board={currentBoard}
            onOpenChange={setIsDeleteModalOpen}
          />
        </Dialog.Root>
      </div>
    </header>
  );
}

function ModalMenu({
  boards,
  boardsQtd,
}: {
  boards: Board[];
  boardsQtd: number;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  return (
    <>
      <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Dialog.Trigger asChild>
          <button className="text-main-purple cursor-pointer">
            <ChevronDown width={18} height={18} />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="dark:bg-dark-gray absolute top-1/2 left-1/2 z-50 w-[90vw] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg">
            <div className="p-4">
              <div className="mb-[19px] pl-2">
                <Dialog.Title asChild>
                  <h2 className="text-medium-gray text-xs font-bold tracking-[2.4px]">
                    ALL BOARDS ({boardsQtd})
                  </h2>
                </Dialog.Title>
                <Dialog.Description className="hidden">
                  Select or create a board.
                </Dialog.Description>
              </div>
              <nav className="mb-4">
                {/* BoardList Component */}
                <BoardList boards={boards} setIsMenuOpen={setIsMenuOpen} />
                <div className="text-main-purple hover:text-main-purple-hover ml-[-1rem] max-w-[240px] cursor-pointer px-6 py-4 text-sm font-bold">
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <SquareKanban width={20} height={20} className="shrink-0" />
                    <span className="truncate">+ Create New Board</span>
                  </button>
                </div>
              </nav>
              {/* DarkModeToggle Component */}
              <DarkModeToggle />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {/* Modal New Board */}
      <Dialog.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        {/* ModalNewBoard Component */}
        <ModalNewBoard
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        />
      </Dialog.Root>
    </>
  );
}
