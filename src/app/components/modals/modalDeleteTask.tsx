import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Task } from "app/services/taskService";
import { useTaskActions } from "app/hooks/tasks/useTasks";
import { Ellipsis } from "lucide-react";

export function ModalDeleteTask({
  task,
  onOpenChange,
}: {
  task: Task;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const { handleDeleteTask } = useTaskActions();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleDelete() {
    setIsLoading(true);

    try {
      await handleDeleteTask(task.id, task.column_id);
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      alert("🔴 Error deleting task.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
        <div className="dark:bg-dark-gray flex w-[343px] flex-col gap-6 rounded-md bg-white p-6 md:w-[480px] md:p-8">
          <Dialog.Title asChild>
            <h1 className="text-red text-lg font-bold">Delete this task?</h1>
          </Dialog.Title>
          <Dialog.Description className="text-medium-gray text-[0.8125rem] leading-5">
            Are you sure you want to delete the <strong>{task?.title}</strong>{" "}
            task and its subtasks? This action cannot be reversed.
          </Dialog.Description>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              disabled={isLoading}
              onClick={handleDelete}
              size="sm"
              variant="destructive"
            >
              {isLoading ? (
                <Ellipsis width={19.5} height={19.5} className="animate-ping" />
              ) : (
                "Delete"
              )}
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
