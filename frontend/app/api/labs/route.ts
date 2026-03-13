import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const labs = db.prepare(`
      SELECT l.id, l.labName, l.topics, l.description, l.department,
             p.name as professorName, p.email as professorEmail
      FROM labs l
      LEFT JOIN professors p ON l.professorId = p.id
      ORDER BY l.labName
    `).all();

    return NextResponse.json(labs);
  } catch (error: unknown) {
    console.error("Labs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
