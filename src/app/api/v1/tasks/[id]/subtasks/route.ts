import controller from "infra/controller";
import { MethodNotAllowedError } from "infra/errors";
import subtasks from "models/subtasks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const subtaskInputValues = await request.json();
    const newSubtask = await subtasks.create(id, subtaskInputValues);

    return NextResponse.json(newSubtask, { status: 201 });
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
    const subtasksFound = await subtasks.getSubtasksByTaskId(id);

    return NextResponse.json(subtasksFound, { status: 200 });
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
