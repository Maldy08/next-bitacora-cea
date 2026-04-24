import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";



const API = process.env.URL_API_CEA;

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${API}Bitacora/Temas/GetAll`, {
    headers: { Authorization: `Bearer ${session.user?.token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const res = await fetch(`${API}Bitacora/Temas/Create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user?.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const res = await fetch(`${API}Bitacora/Temas/Update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.user?.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
