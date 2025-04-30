import controller from "infra/controller";
import { MethodNotAllowedError } from "infra/errors";
import boards from "models/boards";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const boardFound = await boards.findOneById(id);

    return NextResponse.json(boardFound, { status: 200 });
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
    const boardInputValues = await request.json();
    const updatedBoard = await boards.update(id, boardInputValues);

    return NextResponse.json(updatedBoard, { status: 200 });
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
    await boards.deleteBoard(id);

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
