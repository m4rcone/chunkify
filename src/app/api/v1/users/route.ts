import controller from "infra/controller";
import { MethodNotAllowedError } from "infra/errors";
import users from "models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const userInputValues = await request.json();

  try {
    const createdUser = await users.create(userInputValues);

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function GET() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
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
