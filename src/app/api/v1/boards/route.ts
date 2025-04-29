import { NextRequest, NextResponse } from "next/server";
import boards from "models/boards";
import controller from "infra/controller";
import { MethodNotAllowedError } from "infra/errors";

export async function GET() {
  try {
    const Found = await boards.getAll();

    return NextResponse.json(Found, { status: 200 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const boardInputValues = await request.json();
    const newBoard = await boards.create(boardInputValues);

    return NextResponse.json(newBoard, { status: 201 });
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
