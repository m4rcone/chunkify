import boards from "models/boards";
import { NextRequest, NextResponse } from "next/server";

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
    console.log(error);
  }
}
