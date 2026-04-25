import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    const url = req.nextUrl;
    const callbackUrl = encodeURIComponent(url.pathname + url.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  const pathname = req.nextUrl.pathname;
  const esEmpleadoResponsable = Boolean(req.auth.user?.esEmpleadoResponsable);
  const esDetalleDeTema = /^\/bitacora\/temas\/[^/]+$/.test(pathname);
  const rutaPermitida =
    pathname === "/bitacora" ||
    pathname.startsWith("/bitacora/Dashboard") ||
    pathname.startsWith("/bitacora/mis-temas") ||
    esDetalleDeTema;

  if (!esEmpleadoResponsable && !rutaPermitida) {
    return NextResponse.redirect(new URL("/bitacora/Dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/bitacora/:path*"],
};
