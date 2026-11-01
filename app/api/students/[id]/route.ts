import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { validateStudent } from "@/lib/validation";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  course: string;
  age: number;
}

type Context = {
  params: Promise<{ id: string }>;
};

async function getId(context: Context) {
  const { id } = await context.params;
  const parsed = Number(id);

  return Number.isInteger(parsed) && parsed > 0
    ? parsed
    : null;
}



// GET /api/students/:id
export async function GET(
  _request: Request,
  context: Context
) {
  try {
    const id = await getId(context);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid student ID." },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute<Student[]>(
      "SELECT * FROM students WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// PUT /api/students/:id
export async function PUT(
  request: Request,
  context: Context
) {
  try {
    const id = await getId(context);
    const input = validateStudent(await request.json());

    if (!id || !input) {
      return NextResponse.json(
        { message: "Invalid input." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE students
       SET name = ?, email = ?, course = ?, age = ?
       WHERE id = ?`,
      [
        input.name,
        input.email,
        input.course,
        input.age,
        id,
      ]
    );

    if (!result.affectedRows) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }

    const [rows] = await pool.execute<Student[]>(
      "SELECT * FROM students WHERE id = ?",
      [id]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// DELETE /api/students/:id
export async function DELETE(
  _request: Request,
  context: Context
) {
  try {
    const id = await getId(context);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid student ID." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM students WHERE id = ?",
      [id]
    );

    if (!result.affectedRows) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}