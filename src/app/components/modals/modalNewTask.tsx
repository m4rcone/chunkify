import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Ellipsis, X } from "lucide-react";
import { Button } from "../ui/button";
import { Column } from "app/services/boardService";
import { Subtask } from "app/services/taskService";
import { useTaskActions } from "app/hooks/tasks/useTasks";

export function ModalNewTask({
  columns,
  open,
  onOpenChange,
}: {
  columns: Column[];
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [columnId, setColumnId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { handleCreateTask } = useTaskActions();

  useEffect(() => {
    if (open) {
      setTaskTitle("");
      setTaskDescription("");
      setSubtasks([]);
      setColumnId(columns[0].id);
    }
  }, [open, columns]);

  const addSubtask = () => {
    const newColumnId = Math.random().toString(36).substring(2, 15);
    setSubtasks([...subtasks, { id: newColumnId, title: "" }]);
  };

  const removeSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== subtaskId));
  };

  const updateSubtaskTitle = (subtaskId: string, title: string) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, title } : subtask,
      ),
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (e) {
      e.preventDefault();
    }
    setIsLoading(true);

    const taskObject = {
      title: taskTitle,
      description: taskDescription,
      subtasks: subtasks,
      column_id: columnId,
    };

    try {
      await handleCreateTask(taskObject);
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      alert("🔴 Error creating task.");
      console.error(error);
    } finally {
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
            <h1 className="text-lg font-bold">Add New Task</h1>
          </Dialog.Title>
          <Dialog.Description className="hidden">
            Add new task.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="taskTitle"
                className="text-medium-gray text-xs font-bold dark:text-white"
              >
                Title
              </label>
              <input
                required
                id="taskTitle"
                type="text"
                maxLength={120}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Take coffee break"
                className="border-medium-gray/25 placeholder:text-medium-gray/25 focus:ring-main-purple w-full rounded-sm border px-4 py-2 text-sm text-black focus:ring-1 focus:outline-none dark:text-white"
              />
            </div>
            {/* Description */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="taskDescription"
                className="text-medium-gray text-xs font-bold dark:text-white"
              >
                Description
              </label>
              <textarea
                required
                id="taskDescription"
                maxLength={500}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
                className="border-medium-gray/25 placeholder:text-medium-gray/25 focus:ring-main-purple h-[112px] w-full rounded-sm border px-4 py-2 text-sm leading-[23px] text-black focus:ring-1 focus:outline-none dark:text-white"
              />
            </div>
            {/* Subtasks */}
            <div className="flex flex-col gap-2">
              <h2 className="text-medium-gray text-xs font-bold dark:text-white">
                Subtasks
              </h2>
              <div className="flex flex-col gap-3">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-4">
                    <input
                      required
                      id={subtask.id}
                      type="text"
                      maxLength={120}
                      value={subtask.title}
                      onChange={(e) =>
                        updateSubtaskTitle(subtask.id, e.target.value)
                      }
                      placeholder="e.g. Make coffee"
                      className="border-medium-gray/25 placeholder:text-medium-gray/25 focus:ring-main-purple w-[264px] rounded-sm border px-4 py-2 text-sm text-black focus:ring-1 focus:outline-none md:w-[385px] dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="text-medium-gray hover:text-red-hover cursor-pointer"
                    >
                      <X />
                    </button>
                  </div>
                ))}
                <Button
                  disabled={subtasks?.length >= 3}
                  title="Max 3 subtasks"
                  onClick={() => addSubtask()}
                  variant="secundary"
                  size="sm"
                  type="button"
                >
                  {subtasks?.length >= 3
                    ? "Max 3 subtasks"
                    : "+ Add New Subtask"}
                </Button>
              </div>
            </div>
            {/* Status (column) */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="status"
                className="text-medium-gray text-xs font-bold dark:text-white"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                onChange={(e) => setColumnId(e.target.value)}
                value={columnId}
                className="border-medium-gray/25 placeholder:text-medium-gray/25 focus:ring-main-purple w-full rounded-sm border px-4 py-2 text-sm text-black focus:ring-1 focus:outline-none dark:text-white"
              >
                {columns?.map((column) => (
                  <option
                    key={column.id}
                    value={column.id}
                    className="dark:bg-dark-gray text-sm text-black dark:text-white"
                  >
                    {column.name}
                  </option>
                ))}
              </select>
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
                "Create Task"
              )}
            </Button>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
