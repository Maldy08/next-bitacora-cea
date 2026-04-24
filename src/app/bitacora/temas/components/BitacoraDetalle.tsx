"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AvanceDto } from "@/app/domain/dtos";
import { LoadingSpinner } from "@/app/components";
import {
  IoArrowBackOutline,
  IoAddOutline,
  IoDocumentAttachOutline,
  IoTrashOutline,
  IoTimeOutline,
} from "react-icons/io5";
import Link from "next/link";
import { ModalNuevaEntrada } from "./ModalNuevaEntrada";
import { getAvancesByTema } from "@/app/infrastructure/data-access/bitacora/get-bitacora-by-tema";
import { deleteAvance } from "@/app/infrastructure/data-access/avances/delete-avance";

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

export const BitacoraDetalle = ({ idTema }: Props) => {
  const { data: session } = useSession();
  const [entradas, setEntradas] = useState<AvanceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const token = (session?.user as any)?.token ?? "";

  const fetchEntradas = async () => {
    setLoading(true);
    try {
      const data = await getAvancesByTema(idTema, token);
      setEntradas(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntradas(); }, [idTema, session]);

  const handleEliminar = async (idAvance: number) => {
    if (!confirm("¿Deseas eliminar esta entrada?")) return;
    try {
      await deleteAvance(idAvance, token);
      setEntradas((prev) => prev.filter((e) => e.idAvance !== idAvance));
    } catch (error) {
      console.error(error);
    }
  };

  const rol = (session?.user as any)?.rol;
  const puedeCapturar = rol === 1 || rol === 2 || rol === undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/bitacora/temas"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <IoArrowBackOutline className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bitácora</h1>
            <p className="text-sm text-slate-500">Registro de avances del tema</p>
          </div>
        </div>
        {puedeCapturar && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-800 transition"
          >
            <IoAddOutline className="w-5 h-5" />
            Nueva Entrada
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : entradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <IoDocumentAttachOutline className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-500">Sin entradas en la bitácora</p>
          <p className="text-xs text-slate-400 mt-1">Las entradas registradas aparecerán aquí</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-200" />

          <div className="space-y-1">
            {entradas.map((entrada, index) => {
              const { dia, hora } = formatFecha(entrada.fechaHora);
              const isLast = index === entradas.length - 1;
              return (
                <div key={entrada.idAvance} className={`relative flex gap-5 ${isLast ? "pb-0" : "pb-6"}`}>
                  {/* Avatar node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white">
                      {getInitials(entrada.nombreUsuario)}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 min-w-0 group">
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">

                      {/* Card header */}
                      <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-50">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">
                            {entrada.nombreUsuario}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <IoTimeOutline className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-400">
                              {dia}
                              <span className="mx-1 text-slate-300">·</span>
                              {hora}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEliminar(entrada.idAvance)}
                          title="Eliminar entrada"
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Observation */}
                      <div className="px-5 py-4">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {entrada.observaciones}
                        </p>
                      </div>

                      {/* Attachments */}
                      {entrada.adjuntos?.length > 0 && (
                        <div className="px-5 pb-4 flex flex-wrap gap-2">
                          {entrada.adjuntos.map((adj) => (
                            <a
                              key={adj.idAdjunto}
                              href={adj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100 hover:border-slate-300 transition"
                            >
                              <IoDocumentAttachOutline className="w-3.5 h-3.5 text-slate-400" />
                              {adj.nombre}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modalOpen && (
        <ModalNuevaEntrada
          idTema={idTema}
          onClose={() => setModalOpen(false)}
          onSaved={fetchEntradas}
        />
      )}
    </div>
  );
};
