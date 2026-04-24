import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API = process.env.URL_API_CEA;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ idEmpleado: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { idEmpleado } = await params;
  const res = await fetch(`${API}Empleados/EsEmpleadoResponsable/${idEmpleado}`, {
    headers: { Authorization: `Bearer ${(session.user as any)?.token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
