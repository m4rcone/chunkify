import { NextResponse } from "next/server";
import { MethodNotAllowedError } from "infra/errors";
import controller from "infra/controller";
import migrator from "models/migrator";

export async function GET() {
  try {
    const pendingMigrations = await migrator.runMigrations(true);

    return NextResponse.json(pendingMigrations, { status: 200 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export async function POST() {
  try {
    const migratedMigrations = await migrator.runMigrations(false);

    if (migratedMigrations.length > 0) {
      return NextResponse.json(migratedMigrations, { status: 201 });
    }

    return NextResponse.json(migratedMigrations, { status: 200 });
  } catch (error) {
    return controller.errorHandlerResponse(error);
  }
}

export function PUT() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
}

export function DELETE() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
}

export function PATCH() {
  const publicErrorObject = new MethodNotAllowedError();

  return controller.errorHandlerResponse(publicErrorObject);
}
