import { Board } from "app/services/boardService";
import { Ellipsis, SquareKanban } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type Dispatch, type SetStateAction } from "react";

export function BoardList({
  boards,
  isLoading,
  setIsMenuOpen,
}: {
  boards: Board[];
  isLoading?: boolean;
  setIsMenuOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const params = useParams();
  const boardId = String(params.boardId);

  return (
    <ul className="ml-[-1rem] flex flex-col md:ml-0">
      {isLoading && (
        <li className="flex justify-center">
          <Ellipsis className="text-medium-gray animate-ping" />
        </li>
      )}
      {boards?.map((board) => (
        <li key={board.id}>
          <Link
            onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
            href={`/boards/${board.id}`}
            className={`text-medium-gray flex max-w-[240px] cursor-pointer items-center gap-3 rounded-r-full px-6 py-4 text-sm font-bold ${board.id === boardId ? "bg-main-purple text-white" : "hover:bg-main-purple-hover/10 hover:text-main-purple dark:hover:text-main-purple dark:hover:bg-white"}`}
          >
            <SquareKanban width={20} height={20} className="shrink-0" />
            <span className="truncate">{board.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
