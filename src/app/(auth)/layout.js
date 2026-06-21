export default function AuthLayout({ children }) {
  return (
    <main id="main-content" tabIndex="-1" className="flex-grow flex flex-col outline-none min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {children}
    </main>
  );
}
