import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { Board } from "app/services/boardService";
import { Button } from "../ui/button";
import { useBoardActions } from "app/hooks/boards/useBoards";
import { useState, type Dispatch, type SetStateAction } from "react";

export function ModalDeleteBoard({
  board,
  onOpenChange,
}: {
  board: Board;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { handleDeleteBoard } = useBoardActions();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await handleDeleteBoard(board.id);
      setIsLoading(false);

      onOpenChange(false);

      router.push("/");
    } catch (error) {
      alert("🔴 Error deleting board.");
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
        <div className="dark:bg-dark-gray flex w-[343px] flex-col gap-6 rounded-md bg-white p-6 md:w-[480px] md:p-8">
          <Dialog.Title asChild>
            <h1 className="text-red text-lg font-bold">Delete this board?</h1>
          </Dialog.Title>
          <Dialog.Description className="text-medium-gray text-[0.8125rem] leading-5">
            Are you sure you want to delete the <strong>{board?.name}</strong>{" "}
            board? This action will remove all columns and tasks and cannot be
            reversed.
          </Dialog.Description>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              disabled={isLoading}
              onClick={handleDelete}
              size="sm"
              variant="destructive"
            >
              Delete
            </Button>
            <Dialog.Trigger asChild>
              <Button size="sm" variant="secundary">
                Cancel
              </Button>
            </Dialog.Trigger>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
