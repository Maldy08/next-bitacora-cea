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
  IoArrowBackOutline,
  IoTimeOutline,
  IoLayersOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import Link from "next/link";

const ESTADOS = ["Pendiente", "Activo", "Pausado", "Completado"];
const PAGE_SIZE = 9;

const STATUS_CFG: Record<
  string,
  { badge: string; badgeText: string; bar: string; pctText: string }
> = {
  Pendiente:  { badge: "bg-slate-100",  badgeText: "text-slate-700",   bar: "bg-slate-400",   pctText: "text-slate-500"   },
  Activo:     { badge: "bg-amber-50",   badgeText: "text-amber-700",   bar: "bg-amber-400",   pctText: "text-amber-600"   },
  Pausado:    { badge: "bg-orange-50",  badgeText: "text-orange-700",  bar: "bg-orange-400",  pctText: "text-orange-600"  },
  Completado: { badge: "bg-emerald-50", badgeText: "text-emerald-700", bar: "bg-emerald-500", pctText: "text-emerald-600" },
};

const TemaCard = ({ tema }: { tema: TemaDto }) => {
  const cfg = STATUS_CFG[tema.estado] ?? STATUS_CFG["Pendiente"];
  const fechaLimite = tema.fechaLimite ? new Date(tema.fechaLimite) : null;
  const ultimoAvance = tema.ultimoAvance ? new Date(tema.ultimoAvance) : null;
  const msLeft = fechaLimite ? fechaLimite.getTime() - Date.now() : null;
  const isOverdue = msLeft !== null && msLeft < 0 && tema.estado !== "Completado";
  const isNear = msLeft !== null && !isOverdue && msLeft < 7 * 24 * 60 * 60 * 1000;
  const pct = tema.estado === "Completado" ? 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-slate-200/60 shrink-0">
            <IoLayersOutline className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
            {tema.nombreDepartamento ?? "—"}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${cfg.badge} ${cfg.badgeText}`}>
          {tema.estado}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 space-y-4">
        <div>
          <h3 className="font-black text-slate-800 text-base uppercase leading-snug line-clamp-2 tracking-tight">
            {tema.titulo}
          </h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {tema.descripcion || <span className="italic">Sin descripción</span>}
          </p>
        </div>

        {/* Progreso */}
        <div>
          <div className="flex items-end justify-between mb-1.5">
            <span className="text-xs text-slate-500 font-medium">Progreso</span>
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              {tema.totalAvances} avance{tema.totalAvances !== 1 ? "s" : ""}
            </span>
          </div>
          <p className={`text-2xl font-black tabular-nums leading-none mb-2 ${cfg.pctText}`}>
            {pct}%
          </p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${cfg.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-1 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              {isOverdue
                ? <IoAlertCircleOutline className="w-3.5 h-3.5 text-red-400 shrink-0" />
                : <IoCalendarOutline className="w-3.5 h-3.5 shrink-0" />
              }
              Fecha compromiso
            </span>
            <span className={`font-medium ${isOverdue ? "text-red-500" : isNear ? "text-orange-500" : "text-slate-600"}`}>
              {fechaLimite
                ? fechaLimite.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
                : "Sin fecha"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <IoTimeOutline className="w-3.5 h-3.5 shrink-0" />
              Última actualización
            </span>
            <span className="font-medium text-slate-600">
              {ultimoAvance
                ? ultimoAvance.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" })
                : "Sin registro"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <IoDocumentTextOutline className="w-3.5 h-3.5 shrink-0" />
              Total de avances
            </span>
            <span className="font-medium text-slate-600 tabular-nums">{tema.totalAvances}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-slate-100">
        <Link
          href={`/bitacora/temas/${tema.id}`}
          className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-800 hover:text-primary-600 transition-colors group"
        >
          <IoBookOutline className="w-4 h-4" />
          Ver bitácora
          <IoArrowForwardOutline className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export const MisTemas = () => {
  const { data: session } = useSession();
  const [temas, setTemas] = useState<TemaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [page, setPage] = useState(0);

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

  const totalPages = Math.max(1, Math.ceil(temasFiltrados.length / PAGE_SIZE));
  const temasPagina = temasFiltrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

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
              onClick={() => { setFiltroEstado(f); setPage(0); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                filtroEstado === f
                  ? "bg-primary-900 text-white border-primary-900"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {temasPagina.map((tema) => (
              <TemaCard key={tema.id} tema={tema} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-400">
                Página {page + 1} de {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <IoArrowBackOutline className="w-3.5 h-3.5" />
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <IoArrowForwardOutline className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && temas.length > 0 && (
        <div className="flex items-start gap-2.5 bg-slate-100 rounded-xl px-4 py-3 text-xs text-slate-500">
          <IoInformationCircleOutline className="w-4 h-4 shrink-0 mt-0.5" />
          Selecciona un tema para ver su bitácora y dar seguimiento a los avances registrados.
        </div>
      )}
    </div>
  );
};
