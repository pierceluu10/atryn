import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { getAllLabs } from "@/lib/dynamodb";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const submissions = db.prepare(`
      SELECT id, studentId, labId, videoUrl, status, createdAt
      FROM submissions
      WHERE studentId = ?
      ORDER BY createdAt DESC
    `).all(user.id) as { id: number; studentId: number; labId: string; videoUrl: string; status: string; createdAt: string }[];

    // Look up lab names from DynamoDB
    const labs = await getAllLabs();
    const labMap = new Map(labs.map((l) => [String(l.id), l.labName]));

    const enriched = submissions.map((s) => ({
      ...s,
      labName: labMap.get(String(s.labId)) || "Unknown Lab",
    }));

    return NextResponse.json(enriched);
  } catch (error: unknown) {
    console.error("Student submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
