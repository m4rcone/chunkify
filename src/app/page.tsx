"use client";

import { Ellipsis } from "lucide-react";
import { useBoards } from "./hooks/boards/useBoards";

export default function Page() {
  const { boards, isLoading } = useBoards();

  return (
    <main className="flex h-[calc(100%-64px)] flex-col items-center justify-center px-4 md:h-full md:w-[calc(100%-260px)] md:flex-row">
      <div className="flex flex-col items-center justify-center gap-6">
        <p className="text-medium-gray text-center text-lg font-bold">
          {isLoading && <Ellipsis className="animate-ping" />}
          {!isLoading && boards.length > 0 && "Select a board."}
          {!isLoading &&
            boards.length === 0 &&
            "Create a new board to get started."}
        </p>
      </div>
    </main>
  );
}
