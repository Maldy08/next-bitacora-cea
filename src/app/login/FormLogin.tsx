"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

interface Props {
  titulo: string;
}

export const FormLogin = ({ titulo }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/bitacora/Dashboard";

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().required("Campo obligatorio"),
      password: Yup.string().required("Campo obligatorio"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
          callbackUrl,
        });

        if (res && !res.error) {
          router.push(callbackUrl);
        } else {
          handleAuthError(
            res?.error === "NoPermissions"
              ? "No tienes permisos para acceder a esta aplicación."
              : "Usuario y/o contraseña incorrectos."
          );
          setLoading(false);
        }
      } catch (error: any) {
        handleAuthError(error?.message || "Error desconocido");
        setLoading(false);
      }
    },
  });

  const handleAuthError = (msg: string) => {
    setError(msg);
    setOpen(true);
    setTimeout(() => setOpen(false), 5000);
  };

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase text-primary-800">Acceso institucional</p>
          <h1 className="mt-2 text-xl font-bold leading-tight text-slate-950 md:text-2xl">{titulo}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Ingresa tus credenciales para continuar al sistema.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-800">
                Usuario
              </label>
              <input
                type="text"
                id="email"
                autoComplete="off"
                {...formik.getFieldProps("email")}
                className={`block h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition uppercase
                  placeholder:text-slate-400 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20
                  ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-slate-300"}`}
              />
              <div className="min-h-[1.25rem]">
                {formik.touched.email && formik.errors.email && (
                  <div className="mt-1 text-xs font-medium text-red-600">{formik.errors.email}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-800">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                autoComplete="off"
                {...formik.getFieldProps("password")}
                placeholder="********"
                className={`block h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition
                  placeholder:text-slate-400 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20
                  ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-slate-300"}`}
              />
              <div className="min-h-[1.25rem]">
                {formik.touched.password && formik.errors.password && (
                  <div className="mt-1 text-xs font-medium text-red-600">{formik.errors.password}</div>
                )}
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`flex h-11 w-full items-center justify-center gap-3 rounded-md bg-primary-900 px-5 text-sm font-semibold text-white transition
                hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading && (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Procesando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>

        {open && (
          <div className="px-6 pb-6 sm:px-8">
            <div className="relative animate-openmodal rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800 shadow-md">
              <span className="inline-block max-w-[90%] align-middle text-sm">
                <b>{error}</b>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-2 text-xl font-semibold text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
