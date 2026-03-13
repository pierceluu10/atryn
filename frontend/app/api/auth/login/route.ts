import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = getDb();

    // Check students first
    const student = db.prepare(
      "SELECT id, name, email, password, program, year, interests FROM students WHERE email = ?"
    ).get(email) as { id: number; name: string; email: string; password: string; program: string; year: number; interests: string } | undefined;

    if (student) {
      const valid = bcrypt.compareSync(password, student.password);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = signToken({
        id: student.id,
        email: student.email,
        role: "student",
        name: student.name,
      });

      return NextResponse.json({
        token,
        user: {
          id: student.id,
          role: "student",
          name: student.name,
          email: student.email,
          program: student.program,
          year: student.year,
          interests: student.interests,
        },
      });
    }

    // Check professors
    const professor = db.prepare(
      "SELECT id, name, email, password, department, labName FROM professors WHERE email = ?"
    ).get(email) as { id: number; name: string; email: string; password: string; department: string; labName: string } | undefined;

    if (professor) {
      const valid = bcrypt.compareSync(password, professor.password);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = signToken({
        id: professor.id,
        email: professor.email,
        role: "professor",
        name: professor.name,
      });

      return NextResponse.json({
        token,
        user: {
          id: professor.id,
          role: "professor",
          name: professor.name,
          email: professor.email,
          department: professor.department,
          labName: professor.labName,
        },
      });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
