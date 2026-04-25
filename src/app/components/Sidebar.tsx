"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import {
  IoHomeOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoBookOutline,
  IoListOutline,
  IoSettingsOutline,
  IoChevronDownOutline,
  IoPeopleOutline,
} from "react-icons/io5";

interface SidebarProps {
  user: Session["user"];
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onNavigate?: () => void;
}

const SidebarItem = ({ href, icon, label, onNavigate }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
        isActive
          ? "bg-white/[0.13] text-white font-semibold"
          : "text-white/55 font-medium hover:text-white hover:bg-white/[0.07]"
      }`}
    >
      <span className={`text-lg shrink-0 ${isActive ? "text-white" : "text-white/45"}`}>
        {icon}
      </span>
      <span className="truncate flex-1">{label}</span>
      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />}
    </Link>
  );
};

export const Sidebar = ({ user }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const pathname = usePathname();
  const esEmpleadoResponsable = Boolean(user?.esEmpleadoResponsable);
  const isAdminActive = pathname.startsWith("/bitacora/administracion");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-3.5 left-4 z-50 bg-primary-900 text-white p-2 rounded-lg shadow-md hover:bg-primary-800 transition"
        >
          <IoMenuOutline className="w-5 h-5" />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 w-64 h-screen bg-primary-950 flex flex-col shadow-xl transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-5 py-5 flex items-center justify-center border-b border-white/[0.08] shrink-0">
          <Image src="/logo-blanco.png" alt="Logo CEA" width={165} height={70} priority />
        </div>

        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-3 text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition lg:hidden"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        )}

        <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-0.5">
          <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
            Menú
          </p>

          <SidebarItem
            href="/bitacora/Dashboard"
            icon={<IoHomeOutline />}
            label="Dashboard"
            onNavigate={() => setIsOpen(false)}
          />
          {esEmpleadoResponsable && (
            <SidebarItem
              href="/bitacora/temas"
              icon={<IoListOutline />}
              label="Temas"
              onNavigate={() => setIsOpen(false)}
            />
          )}
          <SidebarItem
            href="/bitacora/mis-temas"
            icon={<IoBookOutline />}
            label="Mis Temas"
            onNavigate={() => setIsOpen(false)}
          />

          {esEmpleadoResponsable && (
            <div className="pt-4">
              <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
                Sistema
              </p>
              <button
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isAdminActive
                    ? "bg-white/[0.13] text-white font-semibold"
                    : "text-white/55 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                <span className={`text-lg shrink-0 ${isAdminActive ? "text-white" : "text-white/45"}`}>
                  <IoSettingsOutline />
                </span>
                <span className="flex-1 text-left truncate">Administración</span>
                <IoChevronDownOutline
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${isAdminOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isAdminOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="pt-1 pl-5 space-y-0.5">
                  <SidebarItem
                    href="/bitacora/administracion/usuarios"
                    icon={<IoPeopleOutline />}
                    label="Usuarios"
                    onNavigate={() => setIsOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};
