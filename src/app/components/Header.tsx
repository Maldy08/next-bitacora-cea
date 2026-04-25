import { auth } from "@/auth";
import { ButtonHeader } from ".";

const sistema = process.env.NOMBRE_SISTEMA;

export const Header = async () => {
  const session = await auth();
  const user = session?.user?.name;
  const nombrecompleto = session?.user?.nombrecompleto;
  const rol = session?.user?.rol;

  const rolDescripcion =
    rol === 1 ? "ADMINISTRADOR" : rol === 2 ? "RESPONSABLE" : "VISUALIZADOR";

  return (
    <header className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] bg-white border-b border-slate-200 px-4 lg:px-6 z-30 h-14 flex items-center">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-3 pl-10 lg:pl-0">
          <span className="hidden sm:block text-sm font-semibold text-slate-700 uppercase tracking-wide truncate">
            {sistema}
          </span>
        </div>
        <ButtonHeader user={user!} nombrecompleto={nombrecompleto!} rol={rolDescripcion} />
      </div>
    </header>
  );
};
