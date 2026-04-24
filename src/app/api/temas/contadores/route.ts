import { auth } from "@/auth";
import { NextResponse } from "next/server";



const API = process.env.URL_API_CEA;

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${API}Bitacora/Temas/GetContadores`, {
    headers: { Authorization: `Bearer ${session.user?.token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
