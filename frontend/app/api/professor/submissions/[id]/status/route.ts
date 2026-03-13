import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "professor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!["shortlisted", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const db = getDb();

    // Verify the submission belongs to the professor's lab
    const submission = db.prepare(`
      SELECT s.id, l.professorId
      FROM submissions s
      JOIN labs l ON s.labId = l.id
      WHERE s.id = ?
    `).get(Number(id)) as { id: number; professorId: number } | undefined;

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.professorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    db.prepare("UPDATE submissions SET status = ? WHERE id = ?").run(status, Number(id));

    return NextResponse.json({ id: Number(id), status });
  } catch (error: unknown) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
