import Image from "next/image";
import { Suspense } from "react";
import { FormLogin } from "./FormLogin";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/bitacora/Dashboard");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-950 to-primary-800 px-4 py-12">
      <div className="mb-8 text-center">
        <Image
          src="/logo-blanco.png"
          alt="Logo CEA"
          width={200}
          height={90}
          className="mx-auto mb-3"
          priority
        />
        <p className="text-primary-200 text-sm mt-1">Sistema de Seguimiento de Temas</p>
      </div>
      <Suspense>
        <FormLogin titulo="Iniciar Sesión" />
      </Suspense>
    </div>
  );
}
