import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { validateStudent } from "@/lib/validation";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  course: string;
  age: number;
  created_at: Date;
}

function errorResponse(error: unknown) {
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

// GET /api/students
export async function GET() {
  try {
    const [rows] = await pool.query<Student[]>(
      "SELECT * FROM students ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/students
export async function POST(request: Request) {
  try {
    const input = validateStudent(await request.json());

    if (!input) {
      return NextResponse.json(
        { message: "Invalid student information." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO students (name, email, course, age)
       VALUES (?, ?, ?, ?)`,
      [input.name, input.email, input.course, input.age]
    );

    const [rows] = await pool.execute<Student[]>(
      "SELECT * FROM students WHERE id = ?",
      [result.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}