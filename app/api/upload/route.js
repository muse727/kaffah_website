import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" });
    }

    // Convert file jadi Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik (biar gak bentrok)
    const filename = Date.now() + "-" + file.name.replaceAll(" ", "_");
    
    // Tentukan folder simpan (public/uploads/posters)
    const uploadDir = path.join(process.cwd(), "public/uploads/posters");

    // Cek folder ada gak? Kalau gak ada, buat dulu
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Simpan file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Balikin alamat URL-nya
    const fileUrl = `/uploads/posters/${filename}`;
    return NextResponse.json({ success: true, url: fileUrl });

  } catch (error) {
    console.log("Error uploading file:", error);
    return NextResponse.json({ success: false, message: "Upload failed" });
  }
}