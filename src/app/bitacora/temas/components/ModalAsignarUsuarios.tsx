"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { TemaDto } from "@/app/domain/dtos";
import { Empleado, TemaInvolucrado } from "@/app/domain/entities";
import {
  IoCloseOutline,
  IoTrashOutline,
  IoSearchOutline,
  IoPersonAddOutline,
  IoPeopleOutline,
  IoMailOutline,
  IoMailUnreadOutline,
} from "react-icons/io5";
import { getEmpleados } from "@/app/infrastructure/data-access/empleados/get-empleados";
import { getInvolucradosByTema } from "@/app/infrastructure/data-access/involucrados/get-involucrados-by-tema";
import { assignInvolucrado } from "@/app/infrastructure/data-access/involucrados/assign-involucrado";
import { removeInvolucrado } from "@/app/infrastructure/data-access/involucrados/remove-involucrado";
import { sendEmail } from "@/app/infrastructure/data-access/email/sendmail";
import { generateEmailDataTemaAsignado } from "./generarCorreoTema";
import { toast } from "@/app/bitacora/store/useToast";
import { EmployeeListSkeleton } from "@/app/components";

interface Props {
  tema: TemaDto;
  onClose: () => void;
}

const getInitials = (nombre: string) => {
  const parts = nombre.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
};

export const ModalAsignarUsuarios = ({ tema, onClose }: Props) => {
  const { data: session } = useSession();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [asignados, setAsignados] = useState<TemaInvolucrado[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<Empleado | null>(null);
  const [tipoInvolucrado, setTipoInvolucrado] = useState<"Responsable" | "Visualizador">("Responsable");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);

  const token = session?.user?.token ?? "";
  const sessionUserId = Number(session?.user?.idUsuario ?? 0);

  const enriquecerAsignados = (
    lista: TemaInvolucrado[],
    listaEmpleados: Empleado[]
  ): TemaInvolucrado[] => {
    const mapaEmpleados = new Map(listaEmpleados.map((e) => [e.empleado, e.nombreCompleto]));
    return lista.map((a) => ({
      ...a,
      nombreUsuario: a.nombreUsuario ?? mapaEmpleados.get(a.idUsuario) ?? `Empleado ${a.idUsuario}`,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [empleadosList, asignadosList] = await Promise.all([
        getEmpleados(token),
        getInvolucradosByTema(tema.id, token),
      ]);
      const lista = (empleadosList ?? []).filter((e) => e.empleado !== sessionUserId);
      setEmpleados(lista);
      setAsignados(enriquecerAsignados(asignadosList ?? [], lista));
      setLoading(false);
    };
    fetchData();
  }, [tema.id, token]);

  const empleadosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    const lista = q
      ? empleados.filter(
          (e) =>
            e.nombreCompleto.toLowerCase().includes(q) ||
            e.descripcionPuesto.toLowerCase().includes(q) ||
            e.descripcionDepto.toLowerCase().includes(q)
        )
      : empleados;

    return [...lista].sort((a, b) => {
      const aEsDepto = a.deptoUe === tema.idDepartamentoOrigen ? 0 : 1;
      const bEsDepto = b.deptoUe === tema.idDepartamentoOrigen ? 0 : 1;
      return aEsDepto - bEsDepto;
    });
  }, [empleados, busqueda, tema.idDepartamentoOrigen]);

  const idsAsignados = useMemo(
    () => new Set(asignados.map((a) => a.idUsuario)),
    [asignados]
  );

  const handleAsignar = async () => {
    if (!seleccionado) return;
    setSaving(true);
    const empleadoAsignado = seleccionado;
    const rol = tipoInvolucrado;
    try {
      await assignInvolucrado(
        {
          idTema: tema.id,
          idUsuario: empleadoAsignado.empleado,
          tipoInvolucrado: rol,
          nombreUsuario: empleadoAsignado.nombreCompleto,
        },
        token
      );
      const updated = await getInvolucradosByTema(tema.id, token);
      setAsignados(enriquecerAsignados(updated ?? [], empleados));
      setSeleccionado(null);

      const tieneCorreo = !!empleadoAsignado.correo?.trim();
      if (tieneCorreo) {
        toast.success(`${empleadoAsignado.nombreCompleto} asignado. Notificando por correo…`);
        notificarPorCorreo(empleadoAsignado, rol);
      } else {
        toast.warning(`${empleadoAsignado.nombreCompleto} asignado, pero no tiene correo registrado.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("No se pudo asignar al empleado.");
    } finally {
      setSaving(false);
    }
  };

  const notificarPorCorreo = async (
    empleado: Empleado,
    rol: "Responsable" | "Visualizador"
  ) => {
    const correo = empleado.correo?.trim();
    if (!correo) return;

    const appUrl =
      process.env.NEXT_PUBLIC_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const asignadoPor =
      session?.user?.nombrecompleto ||
      session?.user?.name ||
      "Sistema";

    const emailData = generateEmailDataTemaAsignado(
      correo,
      empleado.nombreCompleto,
      `${appUrl}/bitacora/temas`,
      tema.titulo,
      tema.descripcion,
      tema.estado,
      tema.nombreDepartamento,
      tema.fechaLimite,
      rol,
      asignadoPor
    );

    try {
      const res = await sendEmail(emailData);
      if (res?.mensaje === "Ok") {
        toast.success(`Correo enviado a ${correo}.`);
      } else {
        toast.warning(`No se pudo enviar el correo a ${correo}.`);
      }
    } catch (err) {
      console.error("No se pudo enviar el correo de notificación:", err);
      toast.warning(`No se pudo enviar el correo a ${correo}.`);
    }
  };

  const handleRemover = async (idUsuarioRemover: number, nombre: string) => {
    setRemovingId(idUsuarioRemover);
    setConfirmRemoveId(null);
    try {
      await removeInvolucrado(tema.id, idUsuarioRemover, token);
      setAsignados((prev) => prev.filter((a) => a.idUsuario !== idUsuarioRemover));
      toast.success(`${nombre} fue removido del tema.`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo remover al empleado.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-openmodal p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[88vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Asignar Empleados
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-sm truncate">{tema.titulo}</p>
          </div>
          <button
             title="Cerrar modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">

          {/* ── Left panel: search + employee list ── */}
          <div className="flex flex-col w-1/2 border-r border-slate-100 min-h-0">

            {/* Search bar */}
            <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="NOMBRE, PUESTO O DEPARTAMENTO..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition placeholder:text-slate-400"
                />
              </div>
              {busqueda && (
                <p className="text-xs text-slate-400 mt-1.5 pl-1">
                  {empleadosFiltrados.length} resultado{empleadosFiltrados.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Employee list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <EmployeeListSkeleton count={6} />
              ) : empleadosFiltrados.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                  Sin resultados para &ldquo;{busqueda}&rdquo;
                </div>
              ) : (
                <ul>
                  {empleadosFiltrados[0]?.deptoUe === tema.idDepartamentoOrigen && (
                    <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {tema.nombreDepartamento}
                      </p>
                    </div>
                  )}
                  {empleadosFiltrados.map((e, idx) => {
                    const yaAsignado = idsAsignados.has(e.empleado);
                    const esSeleccionado = seleccionado?.empleado === e.empleado;
                    const esDepto = e.deptoUe === tema.idDepartamentoOrigen;
                    const anteriorEraDepto = idx > 0 && empleadosFiltrados[idx - 1].deptoUe === tema.idDepartamentoOrigen;
                    const esPrimerOtro = !esDepto && anteriorEraDepto;

                    return (
                      <li key={e.empleado} className="border-b border-slate-50 last:border-0">
                        {esPrimerOtro && (
                          <div className="px-4 py-1.5 bg-slate-50 border-y border-slate-100">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Otros departamentos
                            </p>
                          </div>
                        )}
                        <button
                          disabled={yaAsignado}
                          onClick={() => setSeleccionado(esSeleccionado ? null : e)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-2
                            ${yaAsignado
                              ? "opacity-40 cursor-not-allowed bg-slate-50 border-transparent"
                              : esSeleccionado
                                ? "bg-primary-50 border-primary-500"
                                : "hover:bg-slate-50 border-transparent hover:border-slate-200"
                            }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors
                              ${esSeleccionado
                                ? "bg-primary-600 text-white"
                                : yaAsignado
                                  ? "bg-slate-200 text-slate-500"
                                  : "bg-primary-100 text-primary-800"
                              }`}
                          >
                            {getInitials(e.nombreCompleto)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                                {e.nombreCompleto}
                              </p>
                              {e.correo?.trim() ? (
                                <IoMailOutline
                                  className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0"
                                  title={`Recibirá notificación en ${e.correo}`}
                                />
                              ) : (
                                <IoMailUnreadOutline
                                  className="w-3.5 h-3.5 text-amber-500 flex-shrink-0"
                                  title="Sin correo registrado — no recibirá notificación"
                                />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{e.descripcionPuesto}</p>
                            <p className="text-xs text-slate-400 truncate">{e.descripcionDepto}</p>
                          </div>
                          {yaAsignado && (
                            <span className="flex-shrink-0 text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                              Asignado
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Action bar — appears when an employee is selected */}
            <div
              className={`flex-shrink-0 border-t border-primary-100 bg-primary-50 transition-all duration-200 overflow-hidden
                ${seleccionado ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {seleccionado && (
                <div className="flex items-center gap-2 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {getInitials(seleccionado.nombreCompleto)}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 truncate flex-1 min-w-0">
                    {seleccionado.nombreCompleto}
                  </p>
                  <select
                   title="Responsable|Visualizador"
                    value={tipoInvolucrado}
                    onChange={(e) =>
                      setTipoInvolucrado(e.target.value as "Responsable" | "Visualizador")
                    }
                    className="h-8 text-xs border border-primary-200 rounded-lg px-2 outline-none focus:ring-2 focus:ring-primary-300 bg-white text-slate-700 flex-shrink-0"
                  >
                    <option value="Responsable">Responsable</option>
                    <option value="Visualizador">Visualizador</option>
                  </select>
                  <button
                    onClick={handleAsignar}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-900 text-white rounded-lg text-xs font-semibold hover:bg-primary-800 active:scale-95 transition disabled:opacity-50 flex-shrink-0"
                  >
                    <IoPersonAddOutline className="w-3.5 h-3.5" />
                    {saving ? "Asignando…" : "Asignar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Right panel: assigned team ── */}
          <div className="flex flex-col w-1/2 min-h-0">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-shrink-0">
              <IoPeopleOutline className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex-1">
                Equipo asignado
              </p>
              {asignados.length > 0 && (
                <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {asignados.length}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {asignados.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <IoPeopleOutline className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Sin equipo asignado</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Selecciona un empleado de la lista para comenzar
                  </p>
                </div>
              ) : (
                <ul className="p-3 space-y-2">
                  {asignados.map((a) => (
                    <li
                      key={a.idAsignacion}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition group"
                    >
                      <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {getInitials(a.nombreUsuario ?? "??")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                          {a.nombreUsuario}
                        </p>
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1
                            ${a.tipoInvolucrado === "Responsable"
                              ? "bg-primary-100 text-primary-800"
                              : "bg-secondary-100 text-secondary-800"
                            }`}
                        >
                          {a.tipoInvolucrado}
                        </span>
                      </div>
                      {confirmRemoveId === a.idUsuario ? (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleRemover(a.idUsuario, a.nombreUsuario ?? "Empleado")}
                            disabled={removingId === a.idUsuario}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50"
                          >
                            {removingId === a.idUsuario ? "Quitando…" : "Confirmar"}
                          </button>
                          <button
                            onClick={() => setConfirmRemoveId(null)}
                            disabled={removingId === a.idUsuario}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-100 transition disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRemoveId(a.idUsuario)}
                          disabled={removingId === a.idUsuario}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 disabled:opacity-50 flex-shrink-0"
                          title="Remover empleado"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
