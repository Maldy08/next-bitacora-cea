"use client";

import { ReactNode } from "react";
import { useToast, ToastVariant } from "@/app/bitacora/store/useToast";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoCloseOutline,
} from "react-icons/io5";

const STYLES: Record<ToastVariant, { bg: string; border: string; text: string; icon: ReactNode }> = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    icon: <IoCheckmarkCircleOutline className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: <IoCloseCircleOutline className="w-5 h-5 text-red-600 flex-shrink-0" />,
  },
  info: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-800",
    icon: <IoInformationCircleOutline className="w-5 h-5 text-sky-600 flex-shrink-0" />,
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: <IoWarningOutline className="w-5 h-5 text-amber-600 flex-shrink-0" />,
  },
};

export const Toaster = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const s = STYLES[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 ${s.bg} ${s.border} ${s.text} border rounded-xl shadow-lg px-4 py-3 animate-openmodal`}
          >
            {s.icon}
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className={`${s.text} opacity-60 hover:opacity-100 transition flex-shrink-0`}
              aria-label="Cerrar notificación"
            >
              <IoCloseOutline className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
