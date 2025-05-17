export interface Task {
  id?: string;
  title: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
  column_id?: string;
}

export interface Subtask {
  id?: string;
  title: string;
  is_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
  task_id?: string;
}

export interface TaskObject {
  id?: string;
  title?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  subtasks?: Subtask[];
  column_id?: string;
}

const API_URL = "/api/v1";

export async function fetchTasksByColumnId(key: string): Promise<Task[]> {
  const response = await fetch(key);

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error fetching columns.`);
  }

  const responseBody = await response.json();

  return responseBody;
}

export async function fetchSubtasksByTaskId(key: string): Promise<Subtask[]> {
  const response = await fetch(key);

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error fetching subtasks.`);
  }

  const responseBody = await response.json();

  return responseBody;
}

export async function createTask(taskObject: TaskObject) {
  const newTask = await createNewTask();
  await createNewSubtasks();

  return newTask;

  async function createNewTask() {
    const response = await fetch(
      `${API_URL}/columns/${taskObject.column_id}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskObject.title,
          description: taskObject.description,
          column_id: taskObject.column_id,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`🔴 ${response.status} / Error creating task.`);
    }

    const responseBody = await response.json();

    return responseBody;
  }

  async function createNewSubtasks() {
    if (taskObject.subtasks.length === 0) {
      return;
    }

    for (const subtask of taskObject.subtasks) {
      await fetch(`${API_URL}/tasks/${newTask.id}/subtasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: subtask.title,
          task_id: subtask.task_id,
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`🔴 ${response.status} / Error creating subtask.`);
        }
      });
    }
  }
}

export async function updateColumnTask(taskId: string, newColumnId: string) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      column_id: newColumnId,
    }),
  });

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error updating column task.`);
  }
}

export async function updateSubtaskStatus(
  subtaskId: string,
  newStatus: boolean,
) {
  const response = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      is_completed: newStatus,
    }),
  });

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error updating subtask.`);
  }
}

export async function updateTask(taskObject: TaskObject) {
  const updatedTask = await updateTask();
  const currentSubtasks = await fetchCurrentSubtasks();
  const subtasksToDelete = await identifySubtasksToDelete(currentSubtasks);
  await deleteIdentifySubtasks(subtasksToDelete);
  await updateOrCreateSubtasks();

  return updatedTask;

  async function updateTask() {
    const response = await fetch(`${API_URL}/tasks/${taskObject.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: taskObject.title,
        description: taskObject.description,
        column_id: taskObject.column_id,
      }),
    });

    if (!response.ok) {
      throw new Error(`🔴 ${response.status} / Error updating a task.`);
    }

    const responseBody = await response.json();

    return responseBody;
  }

  async function fetchCurrentSubtasks() {
    const response = await fetch(`${API_URL}/tasks/${taskObject.id}/subtasks`);

    if (!response.ok) {
      throw new Error(`🔴 ${response.status} / Error fetching columns.`);
    }

    const responseBody = await response.json();

    return responseBody;
  }

  async function identifySubtasksToDelete(currentSubtasks: Subtask[]) {
    const subtasksWithTaskId = taskObject.subtasks.filter(
      (subtask) => "task_id" in subtask,
    );

    return currentSubtasks.filter(
      (currentSubtask) =>
        !subtasksWithTaskId.some(
          (newSubtask) => newSubtask.id === currentSubtask.id,
        ),
    );
  }

  async function deleteIdentifySubtasks(subtasksToDelete: Subtask[]) {
    const deletePromises = subtasksToDelete.map((subtaskToDelete) => {
      return fetch(`${API_URL}/subtasks/${subtaskToDelete.id}`, {
        method: "DELETE",
      }).then((response) => {
        if (!response.ok)
          throw new Error(`🔴 ${response.status} / Error deleting subtask.`);
      });
    });

    await Promise.all(deletePromises);
  }

  async function updateOrCreateSubtasks() {
    if (taskObject.subtasks.length === 0) {
      return;
    }

    for (const subtask of taskObject.subtasks) {
      if ("task_id" in subtask) {
        await fetch(`${API_URL}/subtasks/${subtask.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: subtask.title,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(
              `🔴 ${response.status} / Error updating a subtask.`,
            );
          }
        });
      } else {
        await fetch(`${API_URL}/tasks/${taskObject.id}/subtasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: subtask.title,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(
              `🔴 ${response.status} / Error creating a subtask.`,
            );
          }
        });
      }
    }
  }
}

export async function deleteTask(taskId: string) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`🔴 ${response.status} / Error deleting task.`);
  }
}
