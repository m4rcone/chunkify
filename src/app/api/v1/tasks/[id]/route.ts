import controller from "infra/controller";
import { MethodNotAllowedError } from "infra/errors";
import tasks from "models/tasks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const taskFound = await tasks.findOneById(id);

    return NextResponse.json(taskFound, { status: 200 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const taskInputValues = await request.json();
    const updatedTask = await tasks.update(id, taskInputValues);

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await tasks.deleteTask(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function POST() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
}

export async function PUT() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
}
