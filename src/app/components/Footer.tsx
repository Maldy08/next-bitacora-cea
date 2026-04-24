export const Footer = () => {
  return (
    <footer className="hidden md:block bg-white border-t border-slate-200 px-6 py-2 text-center text-xs text-slate-500">
      Comisión Estatal del Agua &copy; {new Date().getFullYear()}
    </footer>
  );
};
