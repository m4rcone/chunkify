import controller from "infra/controller";
import { MethodNotAllowedError } from "infra/errors";
import tasks from "models/tasks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const taskInputValues = await request.json();
    const newTask = await tasks.create(id, taskInputValues);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tasksFound = await tasks.getTasksByColumnId(id);

    return NextResponse.json(tasksFound, { status: 200 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function PUT() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
}

export async function PATCH() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
}

export async function DELETE() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
}
