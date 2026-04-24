"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TemaDto } from "@/app/domain/dtos";
import { LoadingSpinner } from "@/app/components";
import { getTemasByUsuario } from "@/app/infrastructure/data-access/temas/get-temas-by-usuario";
import {
  IoBookOutline,
  IoDocumentTextOutline,
  IoCalendarOutline,
  IoAlertCircleOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import Link from "next/link";

const ESTADOS = ["Pendiente", "Activo", "Pausado", "Completado"];

const CARD_STATUS: Record<string, { border: string; dot: string; badge: string; badgeText: string }> = {
  Pendiente:  { border: "border-t-slate-400",   dot: "bg-slate-400",   badge: "bg-slate-100",  badgeText: "text-slate-700"   },
  Activo:     { border: "border-t-amber-400",   dot: "bg-amber-400",   badge: "bg-amber-50",   badgeText: "text-amber-700"   },
  Pausado:    { border: "border-t-orange-400",  dot: "bg-orange-400",  badge: "bg-orange-50",  badgeText: "text-orange-700"  },
  Completado: { border: "border-t-emerald-500", dot: "bg-emerald-500", badge: "bg-emerald-50", badgeText: "text-emerald-700" },
};

export const MisTemas = () => {
  const { data: session } = useSession();
  const [temas, setTemas] = useState<TemaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
    const idUsuario = (session?.user as any)?.idUsuario;
    const token = (session?.user as any)?.token ?? "";
    if (!idUsuario) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTemasByUsuario(idUsuario, token);
        setTemas(data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const temasFiltrados =
    filtroEstado === "Todos" ? temas : temas.filter((t) => t.estado === filtroEstado);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Mis Temas</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {temas.length} tema{temas.length !== 1 ? "s" : ""} asignado{temas.length !== 1 ? "s" : ""}
        </p>
      </div>

      {!loading && temas.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {["Todos", ...ESTADOS].map((f) => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filtroEstado === f
                  ? "bg-primary-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : temas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="p-5 rounded-2xl bg-slate-100 mb-4">
            <IoBookOutline className="w-10 h-10 opacity-40" />
          </div>
          <p className="font-semibold text-slate-500">Sin temas asignados</p>
          <p className="text-sm mt-1">Cuando te asignen temas aparecerán aquí</p>
        </div>
      ) : temasFiltrados.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No hay temas con estado "{filtroEstado}".
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {temasFiltrados.map((tema) => {
            const cfg = CARD_STATUS[tema.estado] ?? CARD_STATUS["Pendiente"];
            const fechaLimite = tema.fechaLimite ? new Date(tema.fechaLimite) : null;
            const msLeft = fechaLimite ? fechaLimite.getTime() - Date.now() : null;
            const isOverdue = msLeft !== null && msLeft < 0 && tema.estado !== "Completado";
            const isNear = msLeft !== null && !isOverdue && msLeft < 7 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={tema.id}
                className={`bg-white rounded-xl border border-slate-200 border-t-4 ${cfg.border} shadow-sm flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                      <span className="text-[11px] text-slate-400 truncate">
                        {tema.nombreDepartamento ?? "—"}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${cfg.badge} ${cfg.badgeText}`}>
                      {tema.estado}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 leading-snug line-clamp-2">{tema.titulo}</h3>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{tema.descripcion}</p>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium tabular-nums">
                    <IoDocumentTextOutline className="w-3.5 h-3.5 shrink-0" />
                    {tema.totalAvances} avance{tema.totalAvances !== 1 ? "s" : ""}
                  </span>
                  {fechaLimite && (
                    <span className={`flex items-center gap-1 text-[11px] font-medium ${
                      isOverdue ? "text-red-500" : isNear ? "text-orange-500" : "text-slate-400"
                    }`}>
                      {isOverdue
                        ? <IoAlertCircleOutline className="w-3.5 h-3.5 shrink-0" />
                        : <IoCalendarOutline className="w-3.5 h-3.5 shrink-0" />
                      }
                      {fechaLimite.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" })}
                    </span>
                  )}
                </div>

                <div className="px-5 pb-5">
                  <Link
                    href={`/bitacora/temas/${tema.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 transition"
                  >
                    <IoBookOutline className="w-4 h-4" />
                    Ver Bitácora
                    <IoArrowForwardOutline className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
