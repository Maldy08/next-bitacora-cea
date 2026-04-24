import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API = process.env.URL_API_CEA;

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ idTema: string; idUsuario: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { idTema, idUsuario } = await params;
  const res = await fetch(`${API}Bitacora/Involucrados/Remove/${idTema}/${idUsuario}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${(session.user as any)?.token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
