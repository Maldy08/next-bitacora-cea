"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { TemaDto } from "@/app/domain/dtos";
import { IoCloseOutline, IoPencilOutline, IoAddOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { createTema } from "@/app/infrastructure/data-access/temas/create-tema";
import { updateTema } from "@/app/infrastructure/data-access/temas/update-tema";

interface Props {
  tema: TemaDto | null;
  onClose: () => void;
  onSaved: () => void;
}

const ESTADOS = ["Pendiente", "Activo", "Pausado", "Completado"];

const ESTADO_SELECT_STYLE: Record<string, string> = {
  Pendiente:  "bg-slate-100 text-slate-700 border-slate-200",
  Activo:     "bg-amber-50 text-amber-700 border-amber-200",
  Pausado:    "bg-orange-50 text-orange-700 border-orange-200",
  Completado: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const inputBase =
  "w-full border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition placeholder:text-slate-300 bg-white";

const labelBase = "block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5";

export const ModalTema = ({ tema, onClose, onSaved }: Props) => {
  const { data: session } = useSession();
  const isEdit = !!tema;
  const token = session?.user?.token ?? "";

  const formik = useFormik({
    initialValues: {
      titulo: (tema?.titulo ?? "").toUpperCase(),
      descripcion: (tema?.descripcion ?? "").toUpperCase(),
      estado: tema?.estado ?? "Pendiente",
      fechaLimite: tema?.fechaLimite
        ? new Date(tema.fechaLimite).toISOString().split("T")[0]
        : "",
    },
    validationSchema: Yup.object({
      titulo: Yup.string().required("El título es obligatorio"),
      descripcion: Yup.string().required("La descripción es obligatoria"),
      estado: Yup.string().required(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          id: tema?.id ?? 0,
          idDepartamentoOrigen: session?.user?.idDepartamento ?? 0,
          fechaLimite: values.fechaLimite ? new Date(values.fechaLimite) : null,
          estado: values.estado as "Pendiente" | "Activo" | "Pausado" | "Completado",
        };
        if (isEdit) {
          await updateTema(payload, token);
        } else {
          await createTema(payload, token);
        }
        onSaved();
        onClose();
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const estadoStyle =
    ESTADO_SELECT_STYLE[formik.values.estado] ?? ESTADO_SELECT_STYLE["Pendiente"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-openmodal"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        <div className="h-1 bg-gradient-to-r from-primary-900 to-primary-600" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50">
              {isEdit
                ? <IoPencilOutline className="w-4 h-4 text-primary-700" />
                : <IoAddOutline className="w-4 h-4 text-primary-700" />
              }
            </div>
            <div>
              <h2 className="font-bold text-slate-800 leading-tight">
                {isEdit ? "Editar Tema" : "Nuevo Tema"}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isEdit ? "Modifica los datos del tema" : "Completa los datos para registrar un nuevo tema"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className={labelBase}>Título *</label>
            <input
              name="titulo"
              value={formik.values.titulo}
              onChange={(e) => formik.setFieldValue("titulo", e.target.value.toUpperCase())}
              onBlur={formik.handleBlur}
              placeholder="INGRESA EL TÍTULO DEL TEMA"
              className={`${inputBase} ${
                formik.touched.titulo && formik.errors.titulo
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                  : "border-slate-200"
              }`}
            />
            {formik.touched.titulo && formik.errors.titulo && (
              <p className="text-xs text-red-500 mt-1.5">{formik.errors.titulo}</p>
            )}
          </div>

          <div>
            <label className={labelBase}>Descripción *</label>
            <textarea
              name="descripcion"
              value={formik.values.descripcion}
              onChange={(e) => formik.setFieldValue("descripcion", e.target.value.toUpperCase())}
              onBlur={formik.handleBlur}
              rows={3}
              placeholder="DESCRIBE EL TEMA A DAR SEGUIMIENTO"
              className={`${inputBase} resize-none ${
                formik.touched.descripcion && formik.errors.descripcion
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                  : "border-slate-200"
              }`}
            />
            {formik.touched.descripcion && formik.errors.descripcion && (
              <p className="text-xs text-red-500 mt-1.5">{formik.errors.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Estado</label>
              <select
                {...formik.getFieldProps("estado")}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500/20 transition cursor-pointer ${estadoStyle}`}
              >
                {ESTADOS.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelBase}>Fecha Límite</label>
              <input
                type="date"
                {...formik.getFieldProps("fechaLimite")}
                className={`${inputBase} border-slate-200`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
            >
              {formik.isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear tema"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
