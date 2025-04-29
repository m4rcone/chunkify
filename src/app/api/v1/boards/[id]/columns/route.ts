import controller from "infra/controller";
import columns from "models/columns";
import { NextRequest, NextResponse } from "next/server";

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
