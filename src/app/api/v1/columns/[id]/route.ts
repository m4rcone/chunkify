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
    const columnFound = await columns.findOneById(id);

    return NextResponse.json(columnFound, { status: 200 });
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
    const columnInputValues = await request.json();
    const updatedColumn = await columns.update(id, columnInputValues);

    return NextResponse.json(updatedColumn, { status: 200 });
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
    await columns.deleteColumn(id);

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
