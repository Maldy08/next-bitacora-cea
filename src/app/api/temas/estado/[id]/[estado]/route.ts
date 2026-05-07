import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API = process.env.URL_API_CEA;

export async function PUT(_: NextRequest, { params }: { params: Promise<{ id: string; estado: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, estado } = await params;
  const res = await fetch(`${API}Bitacora/Temas/UpdateEstado/${id}/${estado}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${session.user?.token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
