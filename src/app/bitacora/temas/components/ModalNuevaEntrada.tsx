"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import { createAvance } from "@/app/infrastructure/data-access/avances/create-avance";

interface Props {
  idTema: number;
  onClose: () => void;
  onSaved: () => void;
}

export const ModalNuevaEntrada = ({ idTema, onClose, onSaved }: Props) => {
  const { data: session } = useSession();
  const [observaciones, setObservaciones] = useState("");
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
      const token = (session?.user as any)?.token ?? "";
      const idUsuario = (session?.user as any)?.idUsuario ?? 0;
      await createAvance({ idTema, idUsuario, observaciones }, archivos, token);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error al guardar la entrada.");
    } finally {
      setSaving(false);
    }
  };

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
              placeholder="Describe el avance o novedad..."
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600
                ${error ? "border-red-500" : "border-slate-300"}`}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
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
