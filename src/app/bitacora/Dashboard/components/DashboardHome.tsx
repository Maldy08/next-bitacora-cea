"use client";

import { useEffect, useState } from "react";
import { TemaDto } from "@/app/domain/dtos";
import { DashboardSkeleton } from "@/app/components";
import { getTemas } from "@/app/infrastructure/data-access/temas/get-temas";
import { getTemasByUsuario } from "@/app/infrastructure/data-access/temas/get-temas-by-usuario";
import Link from "next/link";
import {
  IoLayersOutline,
  IoTimeOutline,
  IoFlashOutline,
  IoPauseCircleOutline,
  IoCheckmarkCircleOutline,
  IoArrowForwardOutline,
  IoArrowBackOutline,
  IoDocumentTextOutline,
  IoAlertCircleOutline,
  IoCalendarOutline,
} from "react-icons/io5";

const PAGE_SIZE = 5;

interface Props {
  session: any;
}

interface StatusCardProps {
  label: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  barColor: string;
  labelColor: string;
}

const StatusCard = ({
  label,
  value,
  total,
  icon,
  borderColor,
  iconBg,
  iconColor,
  barColor,
  labelColor,
}: StatusCardProps) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${borderColor} shadow-sm p-5 flex flex-col justify-between min-h-[148px] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${labelColor}`}>
          {label}
        </span>
        <div className={`p-1.5 rounded-lg ${iconBg} ${iconColor} shrink-0`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-4xl font-black text-slate-800 leading-none tabular-nums">{value}</p>
        <div className="mt-3 space-y-1.5">
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{pct}% del total</p>
        </div>
      </div>
    </div>
  );
};

export const DashboardHome = ({ session }: Props) => {
  const [temas, setTemas] = useState<TemaDto[]>([]);
  const [loading, setLoading] = useState(true);

  const idDepartamento = session?.user?.idDepartamento as number | undefined;

  useEffect(() => {
    const token = session?.user?.token ?? "";
    const esResponsable = Boolean(session?.user?.esEmpleadoResponsable);
    const idUsuario = session?.user?.idUsuario as number | undefined;

    const fetchData = async () => {
      try {
        if (esResponsable) {
          const [todos, misTemas] = await Promise.all([
            getTemas(token),
            getTemasByUsuario(idUsuario!, token),
          ]);
          const deptTemas = (todos ?? []).filter(
            (t) => !idDepartamento || t.idDepartamentoOrigen === idDepartamento
          );
          const deptIds = new Set(deptTemas.map((t) => t.id));
          setTemas([...deptTemas, ...(misTemas ?? []).filter((t) => !deptIds.has(t.id))]);
        } else {
          const misTemas = await getTemasByUsuario(idUsuario!, token);
          setTemas(misTemas ?? []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  if (loading) return <DashboardSkeleton />;

  const temasPropios = temas.filter(
    (t) => !idDepartamento || t.idDepartamentoOrigen === idDepartamento
  );
  const temasOtros = temas.filter(
    (t) => idDepartamento && t.idDepartamentoOrigen !== idDepartamento
  );

  const total = temas.length;
  const contadores = {
    totalTemas:        total,
    temasPendientes:   temas.filter((t) => t.estado === "Pendiente").length,
    temasActivos:      temas.filter((t) => t.estado === "Activo").length,
    temasPausados:     temas.filter((t) => t.estado === "Pausado").length,
    temasCompletados:  temas.filter((t) => t.estado === "Completado").length,
  };

  const ahora = Date.now();
  const SIETE_DIAS = 7 * 24 * 60 * 60 * 1000;
  const temasConFecha = temas.filter(
    (t) => t.fechaLimite && t.estado !== "Completado"
  );
  const temasVencidos = temasConFecha.filter(
    (t) => new Date(t.fechaLimite!).getTime() - ahora < 0
  );
  const temasPorVencer = temasConFecha.filter((t) => {
    const diff = new Date(t.fechaLimite!).getTime() - ahora;
    return diff >= 0 && diff < SIETE_DIAS;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Bienvenido,{" "}
          <span className="font-semibold">{session?.user?.nombrecompleto}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-xl p-5 flex flex-col justify-between min-h-[148px] shadow-md relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
          <div className="absolute -right-5 -top-5 opacity-[0.08] pointer-events-none">
            <IoLayersOutline className="w-32 h-32 text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary-200">
            Total de Temas
          </span>
          <div>
            <p className="text-5xl font-black text-white leading-none tabular-nums">{total}</p>
            <p className="mt-1.5 text-sm text-primary-200">registrados</p>
          </div>
        </div>

        <StatusCard
          label="Pendientes"
          value={contadores?.temasPendientes ?? 0}
          total={total}
          icon={<IoTimeOutline className="w-4 h-4" />}
          borderColor="border-l-slate-400"
          iconBg="bg-slate-100"
          iconColor="text-slate-500"
          barColor="bg-slate-400"
          labelColor="text-slate-500"
        />
        <StatusCard
          label="Activos"
          value={contadores?.temasActivos ?? 0}
          total={total}
          icon={<IoFlashOutline className="w-4 h-4" />}
          borderColor="border-l-amber-400"
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          barColor="bg-amber-400"
          labelColor="text-amber-600"
        />
        <StatusCard
          label="Pausados"
          value={contadores?.temasPausados ?? 0}
          total={total}
          icon={<IoPauseCircleOutline className="w-4 h-4" />}
          borderColor="border-l-orange-400"
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          barColor="bg-orange-400"
          labelColor="text-orange-600"
        />
        <StatusCard
          label="Completados"
          value={contadores?.temasCompletados ?? 0}
          total={total}
          icon={<IoCheckmarkCircleOutline className="w-4 h-4" />}
          borderColor="border-l-emerald-500"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          barColor="bg-emerald-500"
          labelColor="text-emerald-700"
        />
      </div>

      {(temasVencidos.length > 0 || temasPorVencer.length > 0) && (
        <AlertasFechaLimite
          vencidos={temasVencidos}
          porVencer={temasPorVencer}
        />
      )}

      <TemasSection titulo="Temas Recientes" temas={temasPropios} />
      {temasOtros.length > 0 && (
        <TemasSection titulo="Temas de otros departamentos" temas={temasOtros} />
      )}
    </div>
  );
};

const TemasSection = ({ titulo, temas }: { titulo: string; temas: TemaDto[] }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(temas.length / PAGE_SIZE));
  const paginated = temas.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800">{titulo}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {temas.length} tema{temas.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Link
          href="/bitacora/temas"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-900 transition-colors"
        >
          Ver todos
          <IoArrowForwardOutline className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {paginated.map((tema) => (
          <TemaRow key={tema.id} tema={tema} />
        ))}
        {temas.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">
            No hay temas registrados.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Página {page + 1} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <IoArrowBackOutline className="w-3.5 h-3.5" />
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <IoArrowForwardOutline className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertasFechaLimite = ({
  vencidos,
  porVencer,
}: {
  vencidos: TemaDto[];
  porVencer: TemaDto[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {vencidos.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0">
            <IoAlertCircleOutline className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-bold text-red-700">
                {vencidos.length} tema{vencidos.length !== 1 ? "s" : ""} vencido{vencidos.length !== 1 ? "s" : ""}
              </p>
              <Link
                href="/bitacora/temas"
                className="text-[11px] font-semibold text-red-600 hover:text-red-800"
              >
                Ver
              </Link>
            </div>
            <p className="text-xs text-red-600/80 mt-0.5">
              Pasaron su fecha límite y siguen sin completarse.
            </p>
          </div>
        </div>
      )}
      {porVencer.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-600 shrink-0">
            <IoTimeOutline className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-bold text-orange-700">
                {porVencer.length} tema{porVencer.length !== 1 ? "s" : ""} por vencer
              </p>
              <Link
                href="/bitacora/temas"
                className="text-[11px] font-semibold text-orange-600 hover:text-orange-800"
              >
                Ver
              </Link>
            </div>
            <p className="text-xs text-orange-600/80 mt-0.5">
              Vencen en menos de 7 días.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const STATUS_CONFIG: Record<string, { dot: string; badge: string; badgeText: string }> = {
  Pendiente: { dot: "bg-slate-400",   badge: "bg-slate-100",   badgeText: "text-slate-600"  },
  Activo:    { dot: "bg-amber-400",   badge: "bg-amber-50",    badgeText: "text-amber-700"  },
  Pausado:   { dot: "bg-orange-400",  badge: "bg-orange-50",   badgeText: "text-orange-700" },
  Completado:{ dot: "bg-emerald-500", badge: "bg-emerald-50",  badgeText: "text-emerald-700"},
};

const TemaRow = ({ tema }: { tema: TemaDto }) => {
  const cfg = STATUS_CONFIG[tema.estado] ?? STATUS_CONFIG["Pendiente"];

  const now = new Date();
  const fechaLimite = tema.fechaLimite ? new Date(tema.fechaLimite) : null;
  const msLeft = fechaLimite ? fechaLimite.getTime() - now.getTime() : null;
  const isOverdue = msLeft !== null && msLeft < 0 && tema.estado !== "Completado";
  const isNear = msLeft !== null && !isOverdue && msLeft < 7 * 24 * 60 * 60 * 1000;

  const rowAccent = isOverdue
    ? "bg-red-50/40 border-l-4 border-l-red-400 hover:bg-red-50/70"
    : isNear
      ? "bg-orange-50/30 border-l-4 border-l-orange-300 hover:bg-orange-50/60"
      : "border-l-4 border-l-transparent hover:bg-slate-50/70";

  return (
    <Link
      href={`/bitacora/temas/${tema.id}`}
      className={`px-6 py-3.5 flex items-center gap-4 transition-colors group cursor-pointer ${rowAccent}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary-900 transition-colors">
            {tema.titulo}
          </p>
          {isOverdue && (
            <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
              Vencido
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">{tema.nombreDepartamento ?? "—"}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {tema.totalAvances > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium tabular-nums">
            <IoDocumentTextOutline className="w-3.5 h-3.5" />
            {tema.totalAvances}
          </span>
        )}

        {fechaLimite ? (
          <span
            className={`flex items-center gap-1 text-[11px] font-medium ${
              isOverdue ? "text-red-600" : isNear ? "text-orange-600" : "text-slate-400"
            }`}
          >
            {isOverdue
              ? <IoAlertCircleOutline className="w-3.5 h-3.5" />
              : <IoCalendarOutline className="w-3.5 h-3.5" />
            }
            {fechaLimite.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" })}
          </span>
        ) : (
          <span className="text-[11px] text-slate-300">Sin fecha</span>
        )}

        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cfg.badge} ${cfg.badgeText}`}>
          {tema.estado}
        </span>
      </div>
    </Link>
  );
};
