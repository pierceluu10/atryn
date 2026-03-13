import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, name, email, password, ...rest } = body;

    if (!role || !name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    const hashedPassword = bcrypt.hashSync(password, 10);

    if (role === "student") {
      const { program, year, interests } = rest;
      if (!program || !year) {
        return NextResponse.json({ error: "Missing program or year" }, { status: 400 });
      }

      const existing = db.prepare("SELECT id FROM students WHERE email = ?").get(email);
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const result = db.prepare(
        "INSERT INTO students (name, email, password, program, year, interests) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(name, email, hashedPassword, program, Number(year), interests || "");

      const token = signToken({
        id: Number(result.lastInsertRowid),
        email,
        role: "student",
        name,
      });

      return NextResponse.json({
        token,
        user: {
          id: Number(result.lastInsertRowid),
          role: "student",
          name,
          email,
          program,
          year: Number(year),
          interests: interests || "",
        },
      });
    }

    if (role === "professor") {
      const { department, labName } = rest;
      if (!department || !labName) {
        return NextResponse.json({ error: "Missing department or labName" }, { status: 400 });
      }

      const existing = db.prepare("SELECT id FROM professors WHERE email = ?").get(email);
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const result = db.prepare(
        "INSERT INTO professors (name, email, password, department, labName) VALUES (?, ?, ?, ?, ?)"
      ).run(name, email, hashedPassword, department, labName);

      const profId = Number(result.lastInsertRowid);

      // Auto-create a lab for the professor
      db.prepare(
        "INSERT INTO labs (labName, professorId, topics, description, department) VALUES (?, ?, '', '', ?)"
      ).run(labName, profId, department);

      const token = signToken({ id: profId, email, role: "professor", name });

      return NextResponse.json({
        token,
        user: {
          id: profId,
          role: "professor",
          name,
          email,
          department,
          labName,
        },
      });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
