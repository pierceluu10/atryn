import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const submissions = db.prepare(`
      SELECT s.id, s.studentId, s.labId, s.videoUrl, s.status, s.createdAt,
             l.labName
      FROM submissions s
      LEFT JOIN labs l ON s.labId = l.id
      WHERE s.studentId = ?
      ORDER BY s.createdAt DESC
    `).all(user.id);

    return NextResponse.json(submissions);
  } catch (error: unknown) {
    console.error("Student submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
