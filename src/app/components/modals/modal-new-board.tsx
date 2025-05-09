import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useBoardActions } from "app/hooks/boards/useBoards";
import { Column } from "app/services/boardService";
import * as Dialog from "@radix-ui/react-dialog";

export function ModalNewBoard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [boardName, setBoardName] = useState<string>("");
  const [columns, setColumns] = useState<Column[]>([]);
  const { handleCreateBoard } = useBoardActions();

  const router = useRouter();

  useEffect(() => {
    if (open) {
      setBoardName("");
      setColumns([]);
    }
  }, [open]);

  const addColumn = () => {
    const newColumnId = Math.random().toString(36).substring(2, 15);
    setColumns([...columns, { id: newColumnId, name: "" }]);
  };

  const removeColumn = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId));
  };

  const updateColumnName = (columnId: string, name: string) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId ? { ...column, name } : column,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

    if (e) {
      e.preventDefault();
    }

    const boardObject = { name: boardName, columns };

    try {
      const createdBoardId = await handleCreateBoard(boardObject);
      setIsLoading(false);
      onOpenChange(false);

      router.push(`/boards/${createdBoardId}`);
    } catch (error) {
      alert("🔴 Error creating board.");
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content
        onPointerDownOutside={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
        className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="dark:bg-dark-gray flex w-[343px] flex-col gap-6 rounded-md bg-white p-6 md:w-[480px] md:p-8 dark:text-white">
          <Dialog.Title asChild>
            <h1 className="text-lg font-bold">Add New Board</h1>
          </Dialog.Title>
          <Dialog.Description className="hidden">
            Add new board.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Board Name Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="boardName"
                className="text-medium-gray text-xs font-bold dark:text-white"
              >
                Board Name
              </label>
              <input
                required
                id="boardName"
                type="text"
                maxLength={30}
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="e.g. Web Design"
                className="border-medium-gray/25 placeholder:text-medium-gray/25 focus:ring-main-purple w-full rounded-sm border px-4 py-2 text-sm text-black focus:ring-1 focus:outline-none dark:text-white"
              />
            </div>
            {/* Board Columns */}
            <div className="flex flex-col gap-2">
              <h2 className="text-medium-gray text-xs font-bold dark:text-white">
                Board Columns
              </h2>
              <div className="flex flex-col gap-3">
                {columns.map((column) => (
                  <div key={column.id} className="flex items-center gap-4">
                    <input
                      required
                      id={column.id}
                      type="text"
                      maxLength={20}
                      value={column.name}
                      onChange={(e) =>
                        updateColumnName(column.id, e.target.value)
                      }
                      placeholder="e.g. Doing"
                      className="border-medium-gray/25 placeholder:text-medium-gray/25 focus:ring-main-purple w-[264px] rounded-sm border px-4 py-2 text-sm text-black focus:ring-1 focus:outline-none md:w-[385px] dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeColumn(column.id)}
                      className="text-medium-gray hover:text-red-hover cursor-pointer"
                    >
                      <X />
                    </button>
                  </div>
                ))}
                <Button
                  variant="secundary"
                  size="sm"
                  type="button"
                  onClick={() => addColumn()}
                >
                  + Add New Column
                </Button>
              </div>
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              variant="primary"
              size="sm"
            >
              Create New Board
            </Button>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
