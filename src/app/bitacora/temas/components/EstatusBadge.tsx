export const EstadoBadge = ({ estado }: { estado: string }) => {
  const config: Record<string, string> = {
    Pendiente: "bg-slate-100 text-slate-700",
    Activo: "bg-yellow-100 text-yellow-800",
    Pausado: "bg-orange-100 text-orange-800",
    Completado: "bg-green-100 text-green-800",
  };
  const classes = config[estado] ?? "bg-slate-100 text-slate-800";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${classes}`}>{estado}</span>
  );
};
