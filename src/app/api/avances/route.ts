import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API = process.env.URL_API_CEA;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const incoming = await req.formData();
  const outgoing = new FormData();
  for (const [key, value] of incoming.entries()) {
    outgoing.append(key, value);
  }

  console.log("[POST /api/avances] campos enviados:", [...incoming.entries()].map(([k, v]) => `${k}=${typeof v === "string" ? v : v.name}`));

  const res = await fetch(`${API}Bitacora/Avances/Create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user?.token}`,
      Accept: "application/json",
    },
    body: outgoing,
  });
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }
  return NextResponse.json(data, { status: res.status });
}
