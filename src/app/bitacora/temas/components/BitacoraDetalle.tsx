"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AvanceDto } from "@/app/domain/dtos";
import { EstadoTema, Tema, TemaInvolucrado } from "@/app/domain/entities";
import { TimelineSkeleton } from "@/app/components";
import {
  IoArrowBackOutline,
  IoAddOutline,
  IoDocumentAttachOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
  IoPencilOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import Link from "next/link";
import { ModalNuevaEntrada } from "./ModalNuevaEntrada";
import { ModalEditarEntrada } from "./ModalEditarEntrada";
import { EstadoBadge } from "./EstatusBadge";
import { getAvancesByTema } from "@/app/infrastructure/data-access/bitacora/get-bitacora-by-tema";
import { getTemaById } from "@/app/infrastructure/data-access/temas/get-tema-by-id";
import { getInvolucradosByTema } from "@/app/infrastructure/data-access/involucrados/get-involucrados-by-tema";

interface Props {
  idTema: number;
}

const getInitials = (nombre: string) => {
  const parts = (nombre ?? "").trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (nombre ?? "?").slice(0, 2).toUpperCase();
};

const formatFecha = (fecha: Date | string) => {
  const d = new Date(fecha);
  const dia = d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  const hora = d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  return { dia, hora };
};

const getEntradaLabel = (total: number) => `entrada${total !== 1 ? "s" : ""}`;

export const BitacoraDetalle = ({ idTema }: Props) => {
  const { data: session } = useSession();
  const [tema, setTema] = useState<Tema | null>(null);
  const [entradas, setEntradas] = useState<AvanceDto[]>([]);
  const [involucrados, setInvolucrados] = useState<TemaInvolucrado[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [entradaEditando, setEntradaEditando] = useState<AvanceDto | null>(null);

  const token = session?.user?.token ?? "";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [temaData, avances, involucradosData] = await Promise.all([
        getTemaById(idTema, token),
        getAvancesByTema(idTema, token),
        getInvolucradosByTema(idTema, token),
      ]);
      setTema(temaData ?? null);
      setEntradas(avances ?? []);
      setInvolucrados(involucradosData ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [idTema, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  const handleEntradaEditada = (id: number, nuevasObservaciones: string, nuevoEstado: EstadoTema) => {
    setEntradas((prev) => {
      const next = prev.map((e) =>
        e.idAvance === id
          ? { ...e, observaciones: nuevasObservaciones, estado: nuevoEstado, fechaEdicion: new Date() }
          : e
      );
      const ultimo = [...next].sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())[0];
      if (ultimo?.idAvance === id) {
        setTema((t) => (t ? { ...t, estado: nuevoEstado } : t));
      }
      return next;
    });
  };

  const sessionUserId = Number(session?.user?.idUsuario ?? 0);
  const rol = session?.user?.rol;
  const esResponsableDepto = Boolean(session?.user?.esEmpleadoResponsable);
  const idDepartamentoUsuario = session?.user?.idDepartamento;
  const puedeCapturar = rol === 1 || rol === 2 || rol === undefined;

  const estadoActual: EstadoTema = tema?.estado ?? "Pendiente";

  const esInvolucrado = involucrados.some((i) => i.idUsuario === sessionUserId);
  const esAdmin = rol === 1;
  const esResponsableDeDepto =
    esResponsableDepto &&
    !!tema &&
    !!idDepartamentoUsuario &&
    tema.idDepartamentoOrigen === idDepartamentoUsuario;
  const tieneAcceso = !tema || esAdmin || esResponsableDeDepto || esInvolucrado;

  if (!loading && tema && !tieneAcceso) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
          <IoLockClosedOutline className="h-7 w-7 text-slate-400" />
        </div>
        <p className="text-base font-bold text-slate-700">No tienes acceso a este tema</p>
        <p className="mt-1 text-sm text-slate-500">
          Solo los involucrados o el administrador pueden ver esta bitácora.
        </p>
        <Link
          href="/bitacora/temas"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <IoArrowBackOutline className="h-4 w-4" />
          Volver a temas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/bitacora/temas"
            className="shrink-0 p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
            title="Volver a temas"
          >
            <IoArrowBackOutline className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-800">Bitácora</h1>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <span>Registro de avances del tema</span>
              {tema && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="font-medium text-slate-600 truncate max-w-[18rem]">{tema.titulo}</span>
                  <EstadoBadge estado={estadoActual} />
                </>
              )}
            </p>
          </div>
        </div>

        {puedeCapturar && tema && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-800 transition"
          >
            <IoAddOutline className="w-5 h-5" />
            Nueva Entrada
          </button>
        )}
      </div>

      {loading ? (
        <TimelineSkeleton count={4} />
      ) : entradas.length === 0 ? (
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
            <IoDocumentTextOutline className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Sin entradas en la bitácora</p>
          <p className="mt-1 text-xs text-slate-400">Las entradas registradas aparecerán aquí</p>
          {puedeCapturar && tema && (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-5 flex items-center gap-2 rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
            >
              <IoAddOutline className="h-5 w-5" />
              Nueva Entrada
            </button>
          )}
        </div>
      ) : (
        <section className="mx-auto max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-700">Entradas registradas</h2>
              <p className="text-xs text-slate-400">
                {entradas.length} {getEntradaLabel(entradas.length)} en esta bitácora
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {entradas.map((entrada) => {
              const { dia, hora } = formatFecha(entrada.fechaHora);

              return (
                <article
                  key={entrada.idAvance}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4 px-4 py-4 sm:px-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">
                      {getInitials(entrada.nombreUsuario)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-bold text-slate-800">
                              {entrada.nombreUsuario}
                            </h3>
                            {entrada.estado && <EstadoBadge estado={entrada.estado} />}
                            {entrada.fechaEdicion && (
                              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                editado
                              </span>
                            )}
                          </div>
                          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-400">
                            <IoTimeOutline className="h-3.5 w-3.5 shrink-0" />
                            <span>{dia}</span>
                            <span className="text-slate-300">·</span>
                            <span>{hora}</span>
                          </p>
                        </div>

                        {entrada.idUsuario === sessionUserId && (
                          <button
                            onClick={() => setEntradaEditando(entrada)}
                            title="Editar entrada"
                            className="shrink-0 rounded-lg p-2 text-slate-300 transition hover:bg-primary-50 hover:text-primary-600 focus:bg-primary-50 focus:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                          >
                            <IoPencilOutline className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {entrada.observaciones}
                      </p>

                      {entrada.adjuntos?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                          {entrada.adjuntos.map((adj) => (
                            <a
                              key={adj.idAdjunto}
                              href={adj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                            >
                              <IoDocumentAttachOutline className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">{adj.nombre}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {modalOpen && tema && (
        <ModalNuevaEntrada
          tema={tema}
          estadoActual={estadoActual}
          onClose={() => setModalOpen(false)}
          onSaved={fetchData}
        />
      )}

      {entradaEditando && (
        <ModalEditarEntrada
          entrada={entradaEditando}
          onClose={() => setEntradaEditando(null)}
          onEditada={handleEntradaEditada}
        />
      )}
    </div>
  );
};
