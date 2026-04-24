import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";



const API = process.env.URL_API_CEA;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const res = await fetch(`${API}Bitacora/Avances/Create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.user?.token}` },
    body: formData,
  });
  const data = await res.json();
  return NextResponse.json(data);
}
