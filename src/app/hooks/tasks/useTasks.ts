import {
  createTask,
  deleteTask,
  fetchSubtasksByTaskId,
  fetchTasksByColumnId,
  Task,
  updateColumnTask,
  updateSubtaskStatus,
  updateTask,
} from "app/services/taskService";
import { TaskObject } from "models/tasks";
import useSWR, { mutate } from "swr";

const API_URL = "/api/v1";

export function useTasks(columnId: string) {
  const { data, isLoading, error } = useSWR(
    `${API_URL}/columns/${columnId}/tasks`,
    fetchTasksByColumnId,
    {
      shouldRetryOnError: false,
    },
  );

  return {
    tasks: data,
    isLoading,
    error,
  };
}

export function useSubtasks(taskId: string) {
  const { data, isLoading, error } = useSWR(
    `${API_URL}/tasks/${taskId}/subtasks`,
    fetchSubtasksByTaskId,
    {
      shouldRetryOnError: false,
    },
  );

  return {
    subtasks: data,
    isLoading,
    error,
  };
}

export function useTaskActions() {
  async function handleCreateTask(taskObject: TaskObject) {
    const newTask = await createTask(taskObject);

    mutate(`${API_URL}/columns/${newTask.column_id}/tasks`);

    return newTask;
  }

  async function handleUpdateColumnTask(
    task: Task,
    newColumnId: string,
    boardId: string,
  ) {
    await updateColumnTask(task.id, newColumnId);

    mutate(`${API_URL}/boards/${boardId}/columns`);
    mutate(`${API_URL}/columns/${task.column_id}/tasks`);
    mutate(`${API_URL}/columns/${newColumnId}/tasks`);
  }

  async function handleUpdateSubstask(
    taskId: string,
    subtaskId: string,
    newStatus: boolean,
  ) {
    await updateSubtaskStatus(subtaskId, newStatus);

    mutate(`${API_URL}/tasks/${taskId}/subtasks`);
  }

  async function handleUpdateTask(
    taskObject: TaskObject,
    boardId: string,
    CurrentColumnId: string,
  ) {
    const updatedTask = await updateTask(taskObject);

    mutate(`${API_URL}/boards/${boardId}`);
    mutate(`${API_URL}/columns/${CurrentColumnId}/tasks`);
    mutate(`${API_URL}/columns/${updatedTask.column_id}/tasks`);
    mutate(`${API_URL}/tasks/${updatedTask.id}`);
    mutate(`${API_URL}/tasks/${updatedTask.id}/subtasks`);

    return updatedTask;
  }

  async function handleDeleteTask(taskId: string, columnId: string) {
    await deleteTask(taskId);

    mutate(`${API_URL}/columns/${columnId}/tasks`);
  }

  return {
    handleCreateTask,
    handleUpdateColumnTask,
    handleUpdateSubstask,
    handleUpdateTask,
    handleDeleteTask,
  };
}
