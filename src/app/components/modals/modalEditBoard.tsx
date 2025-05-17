import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useBoardActions } from "app/hooks/boards/useBoards";
import { Board, Column } from "app/services/boardService";
import { Button } from "../ui/button";
import { Ellipsis, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function ModalEditBoard({
  board,
  columns,
  open,
  onOpenChange,
}: {
  board: Board;
  columns: Column[];
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const [boardName, setBoardName] = useState<string>("");
  const [editColumns, setEditColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleUpdateBoard } = useBoardActions();

  useEffect(() => {
    if (open) {
      setBoardName(board.name);
      setEditColumns(columns);
    }
  }, [open, board?.name, columns]);

  const addColumn = () => {
    const newColumnId = Math.random().toString(36).substring(2, 15);
    setEditColumns([...editColumns, { id: newColumnId, name: "" }]);
  };

  const removeColumn = (columnId: string) => {
    setEditColumns(editColumns.filter((column) => column.id !== columnId));
  };

  const updateColumnName = (columnId: string, name: string) => {
    setEditColumns(
      editColumns.map((column) =>
        column.id === columnId ? { ...column, name } : column,
      ),
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);

    if (e) {
      e.preventDefault();
    }

    const boardObject = { id: board.id, name: boardName, columns: editColumns };

    try {
      await handleUpdateBoard(boardObject);
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      alert("🔴 Error editing board.");
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content
        onPointerDownOutside={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
        className="absolute top-1/2 left-1/2 z-50 max-h-svh -translate-x-1/2 -translate-y-1/2"
      >
        <div className="scrollbar-custom dark:bg-dark-gray flex max-h-svh w-[343px] flex-col gap-6 overflow-y-auto rounded-md bg-white p-6 md:w-[480px] md:p-8 dark:text-white">
          <Dialog.Title asChild>
            <h1 className="text-lg font-bold">Edit Board</h1>
          </Dialog.Title>
          <Dialog.Description className="hidden">
            Edit board.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Board Name */}
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
                {editColumns.map((column) => (
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
                  disabled={editColumns?.length >= 6}
                  variant="secundary"
                  size="sm"
                  type="button"
                  onClick={() => addColumn()}
                >
                  {editColumns?.length >= 6
                    ? "Max 6 columns"
                    : "+ Add New Column"}
                </Button>
              </div>
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              variant="primary"
              size="sm"
            >
              {isLoading ? (
                <Ellipsis width={19.5} height={19.5} className="animate-ping" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
