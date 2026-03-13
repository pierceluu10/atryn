import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const lab = db.prepare(`
      SELECT l.id, l.labName, l.topics, l.description, l.department,
             p.name as professorName, p.email as professorEmail
      FROM labs l
      LEFT JOIN professors p ON l.professorId = p.id
      WHERE l.id = ?
    `).get(Number(id));

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json(lab);
  } catch (error: unknown) {
    console.error("Lab detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
