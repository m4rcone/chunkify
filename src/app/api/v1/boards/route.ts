import { NextRequest, NextResponse } from "next/server";
import boards from "models/boards";

export async function GET() {
  try {
    const boardsFounded = await boards.getAllBoards();

    return NextResponse.json(boardsFounded, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const boardInputValues = await request.json();
    const newBoard = await boards.create(boardInputValues);

    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    console.log(error);
  }
}
