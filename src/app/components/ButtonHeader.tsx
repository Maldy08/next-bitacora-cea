"use client";

import { useState, useRef, useEffect } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { LogoutButton } from "./LogoutButton";

interface Props {
  user: string;
  nombrecompleto: string;
  rol: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

export const ButtonHeader = ({ user, nombrecompleto, rol }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = getInitials(nombrecompleto || user || "?");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 transition"
      >
        <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-xs font-bold text-white shrink-0 select-none">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[140px] truncate">
          {nombrecompleto || user}
        </span>
        <IoChevronDownOutline
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden animate-openmodal">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-900 flex items-center justify-center text-sm font-bold text-white shrink-0 select-none">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{rol}</p>
              <p className="text-sm font-bold text-slate-800 truncate">{nombrecompleto}</p>
              <p className="text-xs text-slate-400 truncate">{user}</p>
            </div>
          </div>
          <div className="p-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};
