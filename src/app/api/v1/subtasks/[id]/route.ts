import controller from "infra/controller";
import { MethodNotAllowedError } from "infra/errors";
import subtasks from "models/subtasks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const subtaskFound = await subtasks.findOneById(id);

    return NextResponse.json(subtaskFound, { status: 200 });
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
    const subtaskInputValues = await request.json();
    const updatedSubtask = await subtasks.update(id, subtaskInputValues);

    return NextResponse.json(updatedSubtask, { status: 200 });
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
    await subtasks.deleteSubtask(id);

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
