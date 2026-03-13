import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "professor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // Get all labs owned by this professor
    const labs = db.prepare("SELECT id FROM labs WHERE professorId = ?").all(user.id) as { id: number }[];
    const labIds = labs.map((l) => l.id);

    if (labIds.length === 0) {
      return NextResponse.json([]);
    }

    const placeholders = labIds.map(() => "?").join(",");
    const submissions = db.prepare(`
      SELECT s.id, s.studentId, s.labId, s.videoUrl, s.status, s.createdAt,
             st.name as studentName, st.email as studentEmail,
             st.program as studentProgram, st.year as studentYear,
             st.interests as studentInterests,
             l.labName
      FROM submissions s
      LEFT JOIN students st ON s.studentId = st.id
      LEFT JOIN labs l ON s.labId = l.id
      WHERE s.labId IN (${placeholders})
      ORDER BY s.createdAt DESC
    `).all(...labIds);

    return NextResponse.json(submissions);
  } catch (error: unknown) {
    console.error("Professor submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
