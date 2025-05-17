import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Task, Subtask } from "app/services/taskService";
import { useSubtasks, useTaskActions } from "app/hooks/tasks/useTasks";
import { useColumns } from "app/hooks/boards/useBoards";
import { Ellipsis, MoreVertical } from "lucide-react";
import { ModalEditTask } from "./modalEditTask";
import { ModalDeleteTask } from "./modalDeleteTask";

export function ModalTask({
  open,
  onOpenChange,
  task,
  boardId,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  task: Task;
  boardId: string;
}) {
  const [isTaskOptionsOpen, setIsTaskOptionsOpen] = useState<boolean>(false);
  const [columnId, setColumnId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const { columns } = useColumns(boardId);
  const { subtasks } = useSubtasks(task.id);
  const { handleUpdateColumnTask } = useTaskActions();

  const subtasksCompleted = subtasks?.filter(
    (subtask) => subtask.is_completed === true,
  );

  useEffect(() => {
    if (open) {
      setColumnId(task?.column_id);
      setIsTaskOptionsOpen(false);
    }
  }, [open, task?.column_id]);

  const handleEditModalChange = (newState: boolean) => {
    setIsEditModalOpen(newState);
    if (newState) {
      onOpenChange(false);
    }
  };

  const handleDeleteModalChange = (newState: boolean) => {
    setIsDeleteModalOpen(newState);
    if (newState) {
      onOpenChange(false);
    }
  };

  async function handleUpdateTaskStatus(newColumnId: string) {
    setIsLoading(true);

    try {
      await handleUpdateColumnTask(task, newColumnId, boardId);
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      alert("🔴 Error updating status task.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content
          onPointerDownOutside={() => onOpenChange(false)}
          onInteractOutside={() => onOpenChange(false)}
          className="absolute top-1/2 left-1/2 z-50 max-h-svh -translate-x-1/2 -translate-y-1/2"
        >
          <div className="dark:bg-dark-gray scrollbar-custom flex max-h-svh w-[343px] flex-col gap-6 overflow-y-auto rounded-md bg-white p-6 md:w-[480px] md:p-8 dark:text-white">
            <Dialog.Title asChild>
              <div className="flex items-start justify-between">
                <h1 className="text-justify text-lg font-bold break-all">
                  {task.title}
                </h1>
                <button
                  onClick={() => setIsTaskOptionsOpen(!isTaskOptionsOpen)}
                  className="text-medium-gray cursor-pointer"
                >
                  <MoreVertical />
                </button>
              </div>
            </Dialog.Title>
            <Dialog.Description className="text-medium-gray text-justify text-[0.8125rem] leading-[23px] font-medium break-all">
              {task.description}
            </Dialog.Description>
            {/* Subtasks */}
            <div className="flex flex-col gap-2">
              <h2 className="text-medium-gray text-xs font-bold dark:text-white">
                Subtasks ({subtasksCompleted?.length} of {subtasks?.length})
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  {subtasks?.length > 0 &&
                    subtasks.map((subtask) => (
                      <SubtaskItem
                        key={subtask.id}
                        subtask={subtask}
                        taskId={task.id}
                      />
                    ))}
                </div>
              </div>
            </div>
            {/* Status (column) */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="status"
                className="text-medium-gray flex items-center gap-4 text-xs font-bold dark:text-white"
              >
                Current Status{" "}
                {isLoading && (
                  <Ellipsis
                    width={16}
                    height={16}
                    className="text-medium-gray animate-ping"
                  />
                )}
              </label>
              <select
                disabled={isLoading}
                id="status"
                name="status"
                onChange={(e) => handleUpdateTaskStatus(e.target.value)}
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
          </div>

          {/* Task Options */}
          <div
            className={`${!isTaskOptionsOpen && "hidden"} dark:bg-dark-gray/90 absolute top-[64px] right-[-24px] flex w-[120px] flex-col gap-4 rounded-lg bg-white/90 p-4 shadow-md`}
          >
            <button
              onClick={() => {
                handleEditModalChange(true);
              }}
              className="text-medium-gray cursor-pointer text-start text-[0.8125rem] font-bold"
            >
              Edit Task
            </button>
            <button
              onClick={() => {
                handleDeleteModalChange(true);
              }}
              className="text-red cursor-pointer text-start text-[0.8125rem] font-bold"
            >
              Delete Task
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Modal Edit Task */}
      <Dialog.Root open={isEditModalOpen} onOpenChange={handleEditModalChange}>
        <ModalEditTask
          task={task}
          subtasks={subtasks}
          boardId={boardId}
          open={isEditModalOpen}
          onOpenChange={handleEditModalChange}
        />
      </Dialog.Root>

      {/* Modal Delete Task */}
      <Dialog.Root
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteModalChange}
      >
        <ModalDeleteTask task={task} onOpenChange={handleDeleteModalChange} />
      </Dialog.Root>
    </>
  );
}

function SubtaskItem({
  subtask,
  taskId,
}: {
  subtask: Subtask;
  taskId: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { handleUpdateSubstask } = useTaskActions();

  async function handleStatusChange(newStatus: boolean) {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await handleUpdateSubstask(taskId, subtask.id, newStatus);
    } catch (error) {
      alert("🔴 Error updating subtask.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-light-gray dark:bg-very-dark-gray flex items-center gap-4 rounded-sm p-3">
      <label
        className={`flex w-full items-center justify-between text-xs font-bold ${subtask.is_completed ? "text-medium-gray line-through" : "text-black dark:text-white"} mr-2`}
      >
        <div className="flex items-center gap-4 break-all">
          <input
            id={subtask.id}
            className="accent-main-purple h-4 w-4"
            type="checkbox"
            checked={subtask.is_completed}
            onChange={() => handleStatusChange(!subtask.is_completed)}
          />
          {subtask.title}
        </div>

        {isLoading && (
          <div className="flex h-4 w-4 items-center justify-center">
            <Ellipsis
              width={16}
              height={16}
              className="text-medium-gray animate-ping"
            />
          </div>
        )}
      </label>
    </div>
  );
}
