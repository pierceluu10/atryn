import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "videos");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split(".").pop() || "webm";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const videoUrl = `/uploads/videos/${filename}`;

    return NextResponse.json({ videoUrl });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
