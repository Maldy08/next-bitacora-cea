"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { TemaDto } from "@/app/domain/dtos";
import { LoadingSpinner } from "@/app/components";
import {
  IoPencilOutline,
  IoTrashOutline,
  IoPeopleOutline,
  IoAddOutline,
  IoBookOutline,
  IoEllipsisVertical,
  IoSearchOutline,
  IoDocumentTextOutline,
  IoCalendarOutline,
  IoAlertCircleOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";

const PAGE_SIZE = 5;
import { ModalTema } from "./ModalTema";
import { ModalAsignarUsuarios } from "./ModalAsignarUsuarios";
import Link from "next/link";
import { getTemas } from "@/app/infrastructure/data-access/temas/get-temas";
import { deleteTema } from "@/app/infrastructure/data-access/temas/delete-tema";
import { updateTemaEstado } from "@/app/infrastructure/data-access/temas/update-tema-estado";

const ESTADOS = ["Pendiente", "Activo", "Pausado", "Completado"];

const STATUS_CFG: Record<string, { dot: string; select: string }> = {
  Pendiente:  { dot: "bg-slate-400",   select: "bg-slate-100 text-slate-700 border-slate-200"    },
  Activo:     { dot: "bg-amber-400",   select: "bg-amber-50 text-amber-700 border-amber-200"      },
  Pausado:    { dot: "bg-orange-400",  select: "bg-orange-50 text-orange-700 border-orange-200"   },
  Completado: { dot: "bg-emerald-500", select: "bg-emerald-50 text-emerald-700 border-emerald-200"},
};

interface MenuAccionesProps {
  tema: TemaDto;
  onEditar: () => void;
  onAsignar: () => void;
  onEliminar: () => void;
}

const MenuAcciones = ({ tema, onEditar, onAsignar, onEliminar }: MenuAccionesProps) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 4, right: window.innerWidth - rect.right });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dropdown = open ? (
    <div
      ref={menuRef}
      style={{ top: pos.top, right: pos.right }}
      className="fixed z-50 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 animate-openmodal"
    >
      <Link
        href={`/bitacora/temas/${tema.id}`}
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <IoBookOutline className="w-4 h-4 text-slate-400 flex-shrink-0" />
        Ver bitácora
      </Link>
      <button
        onClick={() => { setOpen(false); onAsignar(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <IoPeopleOutline className="w-4 h-4 text-slate-400 flex-shrink-0" />
        Asignar empleados
      </button>
      <button
        onClick={() => { setOpen(false); onEditar(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <IoPencilOutline className="w-4 h-4 text-slate-400 flex-shrink-0" />
        Editar tema
      </button>
      <div className="my-1 border-t border-slate-100" />
      <button
        onClick={() => { setOpen(false); onEliminar(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <IoTrashOutline className="w-4 h-4 flex-shrink-0" />
        Eliminar
      </button>
    </div>
  ) : null;

  return (
    <div className="flex justify-center">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`p-1.5 rounded-lg transition-colors ${
          open ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        }`}
        title="Acciones"
      >
        <IoEllipsisVertical className="w-4 h-4" />
      </button>
      {typeof window !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
};

export const TemasAdmin = () => {
  const { data: session } = useSession();
  const [temas, setTemas] = useState<TemaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
  const [temaEditar, setTemaEditar] = useState<TemaDto | null>(null);
  const [temaAsignar, setTemaAsignar] = useState<TemaDto | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [page, setPage] = useState(0);

  const token = (session?.user as any)?.token ?? "";
  const idDepartamento = session?.user?.idDepartamento;

  const fetchTemas = async () => {
    setLoading(true);
    try {
      const data = await getTemas(token);
      setTemas(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemas(); }, [session]);

  const handleEditar = (tema: TemaDto) => { setTemaEditar(tema); setModalOpen(true); };
  const handleAsignar = (tema: TemaDto) => { setTemaAsignar(tema); setModalAsignarOpen(true); };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Deseas eliminar este tema?")) return;
    await deleteTema(id, token);
    fetchTemas();
  };

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await updateTemaEstado(id, nuevoEstado, token);
      setTemas((prev) => prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const temasFiltrados = temas
    .filter((t) => !idDepartamento || t.idDepartamentoOrigen === idDepartamento)
    .filter((t) => filtroEstado === "Todos" || t.estado === filtroEstado)
    .filter((t) => t.titulo.toLowerCase().includes(busqueda.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(temasFiltrados.length / PAGE_SIZE));
  const temasPagina = temasFiltrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Temas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {temas.length} tema{temas.length !== 1 ? "s" : ""} registrado{temas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setTemaEditar(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-800 transition"
        >
          <IoAddOutline className="w-5 h-5" />
          Nuevo Tema
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar tema..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPage(0); }}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-400 transition w-56"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {["Todos", ...ESTADOS].map((f) => (
            <button
              key={f}
              onClick={() => { setFiltroEstado(f); setPage(0); }}
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
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Título</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Estado</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Fecha Límite</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Avances</th>
                  <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {temasPagina.map((tema) => {
                  const cfg = STATUS_CFG[tema.estado] ?? STATUS_CFG["Pendiente"];
                  const fechaLimite = tema.fechaLimite ? new Date(tema.fechaLimite) : null;
                  const msLeft = fechaLimite ? fechaLimite.getTime() - Date.now() : null;
                  const isOverdue = msLeft !== null && msLeft < 0 && tema.estado !== "Completado";
                  const isNear = msLeft !== null && !isOverdue && msLeft < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <tr key={tema.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-xs group-hover:text-primary-900 transition-colors">
                              {tema.titulo}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{tema.nombreDepartamento ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={tema.estado}
                          onChange={(e) => handleCambiarEstado(tema.id, e.target.value)}
                          className={`text-[11px] font-semibold border rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-primary-600/20 cursor-pointer transition-colors ${cfg.select}`}
                        >
                          {ESTADOS.map((est) => (
                            <option key={est} value={est}>{est}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        {fechaLimite ? (
                          <span className={`flex items-center gap-1 text-xs font-medium ${
                            isOverdue ? "text-red-500" : isNear ? "text-orange-500" : "text-slate-500"
                          }`}>
                            {isOverdue
                              ? <IoAlertCircleOutline className="w-3.5 h-3.5 shrink-0" />
                              : <IoCalendarOutline className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            }
                            {fechaLimite.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" })}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {tema.totalAvances > 0 ? (
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium tabular-nums">
                            <IoDocumentTextOutline className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {tema.totalAvances}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <MenuAcciones
                          tema={tema}
                          onEditar={() => handleEditar(tema)}
                          onAsignar={() => handleAsignar(tema)}
                          onEliminar={() => handleEliminar(tema.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
                {temasFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      {busqueda || filtroEstado !== "Todos"
                        ? "No se encontraron temas con ese criterio."
                        : "No hay temas registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Página {page + 1} de {totalPages} · {temasFiltrados.length} tema{temasFiltrados.length !== 1 ? "s" : ""}
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
      )}

      {modalOpen && (
        <ModalTema
          tema={temaEditar}
          onClose={() => setModalOpen(false)}
          onSaved={fetchTemas}
        />
      )}
      {modalAsignarOpen && temaAsignar && (
        <ModalAsignarUsuarios
          tema={temaAsignar}
          onClose={() => setModalAsignarOpen(false)}
        />
      )}
    </div>
  );
};
