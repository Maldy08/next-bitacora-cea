import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API = process.env.URL_API_CEA;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.formData();

  const FILE_SIZE_LIMIT = parseInt(process.env.NEXT_PUBLIC_FILE_SIZE_LIMIT || "8388608");
  for (const [, value] of body.entries()) {
    if (value instanceof File && value.size > FILE_SIZE_LIMIT) {
      return NextResponse.json(
        { message: "El archivo excede el tamaño máximo permitido." },
        { status: 413 }
      );
    }
  }

  try {
    const response = await fetch(`${API}Email`, {
      method: "POST",
      body: body,
      headers: {
        Authorization: `Bearer ${session.user?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      mensaje: data.succeeded ? "Ok" : "Error",
      data: data,
    });
  } catch (error) {
    console.error("Error al enviar el email:", error);
    return NextResponse.json({ data: "error" });
  }
}
