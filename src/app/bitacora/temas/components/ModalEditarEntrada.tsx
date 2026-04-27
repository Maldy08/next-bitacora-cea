"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { IoCloseOutline } from "react-icons/io5";
import { AvanceDto } from "@/app/domain/dtos";
import { updateAvance } from "@/app/infrastructure/data-access/avances/update-avance";

interface Props {
  entrada: AvanceDto;
  onClose: () => void;
  onEditada: (id: number, nuevasObservaciones: string) => void;
}

export const ModalEditarEntrada = ({ entrada, onClose, onEditada }: Props) => {
  const { data: session } = useSession();
  const [observaciones, setObservaciones] = useState(entrada.observaciones);
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
      await updateAvance(entrada.idAvance, observaciones.trim(), token);
      onEditada(entrada.idAvance, observaciones.trim());
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-openmodal">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Editar Entrada</h2>
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
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
