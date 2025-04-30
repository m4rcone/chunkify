import controller from "infra/controller";
import { MethodNotAllowedError } from "infra/errors";
import columns from "models/columns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const columnsFound = await columns.getColumnsByBoardId(id);

    return NextResponse.json(columnsFound, { status: 200 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const columnInputValues = await request.json();
    const newColumn = await columns.create(id, columnInputValues);

    return NextResponse.json(newColumn, { status: 201 });
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
