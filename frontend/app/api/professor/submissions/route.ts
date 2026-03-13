import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { getAllLabs } from "@/lib/dynamodb";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "professor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // Get all submissions with student info
    const submissions = db.prepare(`
      SELECT s.id, s.studentId, s.labId, s.videoUrl, s.status, s.createdAt,
             st.name as studentName, st.email as studentEmail,
             st.program as studentProgram, st.year as studentYear,
             st.interests as studentInterests
      FROM submissions s
      LEFT JOIN students st ON s.studentId = st.id
      ORDER BY s.createdAt DESC
    `).all() as Record<string, unknown>[];

    // Look up lab names from DynamoDB
    const labs = await getAllLabs();
    const labMap = new Map(labs.map((l) => [String(l.id), l.labName]));

    const enriched = submissions.map((s) => ({
      ...s,
      labName: labMap.get(String(s.labId)) || "Unknown Lab",
    }));

    return NextResponse.json(enriched);
  } catch (error: unknown) {
    console.error("Professor submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
