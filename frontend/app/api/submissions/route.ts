import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { labId, videoUrl } = await req.json();
    if (!labId) {
      return NextResponse.json({ error: "labId is required" }, { status: 400 });
    }

    const db = getDb();

    // Check for duplicate submission
    const existing = db.prepare(
      "SELECT id FROM submissions WHERE studentId = ? AND labId = ?"
    ).get(user.id, labId);

    if (existing) {
      return NextResponse.json({ error: "You have already submitted to this lab" }, { status: 409 });
    }

    const result = db.prepare(
      "INSERT INTO submissions (studentId, labId, videoUrl, status) VALUES (?, ?, ?, 'pending')"
    ).run(user.id, labId, videoUrl || "");

    return NextResponse.json({
      id: Number(result.lastInsertRowid),
      studentId: user.id,
      labId,
      videoUrl: videoUrl || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
