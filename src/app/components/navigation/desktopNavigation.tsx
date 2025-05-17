import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Eye, Info, SquareKanban } from "lucide-react";
import { BoardList } from "./boardList";
import { DarkModeToggle } from "./darkModeToggle";
import { Board } from "app/services/boardService";
import * as Dialog from "@radix-ui/react-dialog";
import { ModalNewBoard } from "../modals/modalNewBoard";

export function DesktopNavigation({
  boards,
  isLoading,
  isSidebarVisible,
  setIsSidebarVisible,
}: {
  boards: Board[];
  isLoading: boolean;
  isSidebarVisible: boolean;
  setIsSidebarVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  // const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const boardsQtd = boards ? boards.length : 0;

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <>
      {/* Header */}
      <header
        className={`dark:bg-dark-gray border-r-lines-light dark:border-r-lines-dark hidden w-[260px] items-center gap-4 border-r bg-white px-6 py-9 md:flex ${!isSidebarVisible && "border-b-lines-light dark:border-b-lines-dark border-b"}`}
      >
        <Link href="/">
          <Image
            src="logo.svg"
            alt=""
            width={24}
            height={25}
            className="h-auto"
          />
        </Link>
        <h1 className="text-lg font-bold text-black dark:text-white">
          Chunkify
        </h1>
      </header>

      {/* Sidebar */}
      {isSidebarVisible && (
        <aside className="dark:bg-dark-gray border-r-lines-light dark:border-r-lines-dark hidden h-[calc(100%-100px)] w-[260px] flex-col justify-between border-r bg-white pt-3.5 pr-6 pb-9 md:flex">
          <div>
            <div className="mb-[19px] pl-6">
              <h2 className="text-medium-gray text-xs font-bold tracking-[2.4px]">
                ALL BOARDS ({boardsQtd})
              </h2>
            </div>
            <nav className="">
              {/* BoardList Component */}
              <BoardList boards={boards} isLoading={isLoading} />
              {/* Modal Create Board */}
              {!isLoading && boards?.length < 5 ? (
                <Dialog.Root
                  open={isCreateModalOpen}
                  onOpenChange={setIsCreateModalOpen}
                >
                  <Dialog.Trigger disabled={false} asChild>
                    <div className="text-main-purple hover:text-main-purple-hover max-w-[240px] cursor-pointer px-6 py-4 text-sm font-bold">
                      <button className="flex cursor-pointer items-center gap-3">
                        <SquareKanban
                          width={20}
                          height={20}
                          className="shrink-0"
                        />
                        <span className="truncate">+ Create New Board</span>
                      </button>
                    </div>
                  </Dialog.Trigger>
                  {/* ModalBoard Component */}
                  <ModalNewBoard
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                  />
                </Dialog.Root>
              ) : (
                !isLoading && (
                  <div className="text-main-purple hover:text-main-purple-hover max-w-[240px] cursor-not-allowed px-6 py-4 text-sm font-bold">
                    <button
                      disabled
                      className="flex cursor-not-allowed items-center gap-3"
                    >
                      <Info width={20} height={20} className="shrink-0" />
                      <span className="truncate">Max 5 boards</span>
                    </button>
                  </div>
                )
              )}
            </nav>
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-4 pl-5">
            {/* DarkMode Component */}
            <DarkModeToggle />
            {/* Hide Sidebar Button */}
            {/* <button
              onClick={toggleSidebar}
              className="text-medium-gray hover:text-main-purple flex cursor-pointer items-center gap-2.5 py-3 pl-1"
            >
              <EyeOff width={20} height={20} />
              <span className="text-sm font-bold">Hide Sidebar</span>
            </button> */}
          </div>
        </aside>
      )}

      {/* Show Sidebar Button */}
      {!isSidebarVisible && (
        <div className="absolute bottom-8 hidden md:block">
          <button
            onClick={toggleSidebar}
            className="bg-main-purple hover:bg-main-purple-hover cursor-pointer rounded-r-full py-[15px] pr-[20px] pl-[18px] text-white"
          >
            <Eye width={18} height={18} />
          </button>
        </div>
      )}
    </>
  );
}
