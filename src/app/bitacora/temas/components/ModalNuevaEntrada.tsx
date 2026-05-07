"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import { createAvance } from "@/app/infrastructure/data-access/avances/create-avance";
import { EstadoTema, Tema } from "@/app/domain/entities";
import { getInvolucradosByTema } from "@/app/infrastructure/data-access/involucrados/get-involucrados-by-tema";
import { getEmpleados } from "@/app/infrastructure/data-access/empleados/get-empleados";
import { sendEmail } from "@/app/infrastructure/data-access/email/sendmail";
import { generateEmailDataNuevoAvance } from "./generarCorreoTema";
import { toast } from "@/app/bitacora/store/useToast";

interface Props {
  tema: Tema;
  estadoActual: EstadoTema;
  onClose: () => void;
  onSaved: () => void;
}

const ESTADOS: EstadoTema[] = ["Pendiente", "Activo", "Pausado", "Completado"];

export const ModalNuevaEntrada = ({ tema, estadoActual, onClose, onSaved }: Props) => {
  const { data: session } = useSession();
  const [observaciones, setObservaciones] = useState("");
  const [estado, setEstado] = useState<EstadoTema>(estadoActual);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observaciones.trim()) {
      setError("El texto es obligatorio.");
      return;
    }
    setSaving(true);
    try {
      const token = session?.user?.token ?? "";
      const idUsuario = session?.user?.idUsuario ?? 0;
      const textoFinal = observaciones.trim().toUpperCase();
      await createAvance(
        { idTema: tema.id, idUsuario, observaciones: textoFinal, estado },
        archivos,
        token
      );

      onSaved();
      onClose();

      void notificarInvolucrados(token, Number(idUsuario), textoFinal);
    } catch (err) {
      console.error(err);
      setError("Error al guardar la entrada.");
      setSaving(false);
    }
  };

  const notificarInvolucrados = async (token: string, sessionUserId: number, textoFinal: string) => {
    try {
      const [involucrados, empleados] = await Promise.all([
        getInvolucradosByTema(tema.id, token),
        getEmpleados(token),
      ]);

      const mapaEmpleados = new Map(empleados.map((e) => [e.empleado, e]));
      const destinatarios = (involucrados ?? [])
        .filter((i) => i.idUsuario !== sessionUserId)
        .map((i) => mapaEmpleados.get(i.idUsuario))
        .filter((e): e is NonNullable<typeof e> => !!e && !!e.correo?.trim());

      if (destinatarios.length === 0) {
        toast.info("Avance guardado. No hay involucrados con correo para notificar.");
        return;
      }

      toast.success(`Avance guardado. Notificando a ${destinatarios.length} involucrado${destinatarios.length !== 1 ? "s" : ""}…`);

      const appUrl =
        process.env.NEXT_PUBLIC_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const capturadoPor =
        session?.user?.nombrecompleto ||
        session?.user?.name ||
        "Sistema";
      const fechaHora = new Date();

      const resultados = await Promise.allSettled(
        destinatarios.map((empleado) => {
          const emailData = generateEmailDataNuevoAvance(
            empleado.correo.trim(),
            empleado.nombreCompleto,
            `${appUrl}/bitacora/temas/${tema.id}`,
            tema.titulo,
            estado,
            capturadoPor,
            textoFinal,
            fechaHora,
            archivos.length
          );
          return sendEmail(emailData);
        })
      );

      const okCount = resultados.filter(
        (r) => r.status === "fulfilled" && r.value?.mensaje === "Ok"
      ).length;
      const failCount = destinatarios.length - okCount;

      if (failCount === 0) {
        toast.success(`Correos enviados (${okCount}).`);
      } else if (okCount === 0) {
        toast.warning(`No se pudieron enviar los correos (${failCount} fallidos).`);
      } else {
        toast.warning(`Correos enviados: ${okCount}. Fallidos: ${failCount}.`);
      }
    } catch (err) {
      console.error("No se pudieron enviar las notificaciones:", err);
      toast.warning("Avance guardado, pero falló el envío de notificaciones.");
    }
  };

  const estadoCambiado = estado !== estadoActual;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-openmodal">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Nueva Entrada en Bitácora</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Avance / Comentario</label>
            <textarea
              value={observaciones}
              onChange={(e) => { setObservaciones(e.target.value); setError(""); }}
              rows={5}
              placeholder="DESCRIBE EL AVANCE O NOVEDAD..."
              className={`w-full border rounded-lg px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600
                ${error ? "border-red-500" : "border-slate-300"}`}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Estado del tema</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoTema)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Estado actual del tema: <span className="font-semibold">{estadoActual}</span>
              {estadoCambiado && (
                <span className="ml-2 text-amber-700">
                  · Al guardar, el tema pasará a <span className="font-semibold">{estado}</span>.
                </span>
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Evidencias (opcional)</label>
            <label className="flex items-center gap-3 cursor-pointer border border-dashed border-slate-300 rounded-lg px-4 py-3 hover:border-primary-600 transition">
              <IoCloudUploadOutline className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-500">
                {archivos.length > 0
                  ? archivos.map((f) => f.name).join(", ")
                  : "Selecciona uno o varios archivos..."}
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setArchivos(Array.from(e.target.files ?? []))}
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 transition disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
