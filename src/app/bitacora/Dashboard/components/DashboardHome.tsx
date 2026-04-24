"use client";

import { useEffect, useState } from "react";
import { TemaContadoresDto, TemaDto } from "@/app/domain/dtos";
import { LoadingSpinner } from "@/app/components";
import { getContadores } from "@/app/infrastructure/data-access/temas/get-contadores";
import { getTemas } from "@/app/infrastructure/data-access/temas/get-temas";
import Link from "next/link";
import {
  IoLayersOutline,
  IoTimeOutline,
  IoFlashOutline,
  IoPauseCircleOutline,
  IoCheckmarkCircleOutline,
  IoArrowForwardOutline,
  IoDocumentTextOutline,
  IoAlertCircleOutline,
  IoCalendarOutline,
} from "react-icons/io5";

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
  const [contadores, setContadores] = useState<TemaContadoresDto | null>(null);
  const [temas, setTemas] = useState<TemaDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = (session?.user as any)?.token ?? "";
    const fetchData = async () => {
      try {
        const [cont, temasList] = await Promise.all([
          getContadores(token),
          getTemas(token),
        ]);
        setContadores(cont);
        setTemas(temasList ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  if (loading) return <LoadingSpinner />;

  const total = contadores?.totalTemas ?? 0;

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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">Temas Recientes</h2>
            <p className="text-xs text-slate-400 mt-0.5">{temas.length} tema{temas.length !== 1 ? "s" : ""} en total</p>
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
          {temas.slice(0, 10).map((tema) => (
            <TemaRow key={tema.id} tema={tema} />
          ))}
          {temas.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              No hay temas registrados.
            </div>
          )}
        </div>
      </div>
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

  return (
    <div className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/70 transition-colors group">
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary-900 transition-colors">
          {tema.titulo}
        </p>
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
              isOverdue ? "text-red-500" : isNear ? "text-orange-500" : "text-slate-400"
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
    </div>
  );
};
