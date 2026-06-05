function Navbar() {
  return (
    <nav className="bg-slate-800 text-white px-8 py-3 flex items-center justify-between shadow-md dark:bg-gray-200 dark:text-black transition">
      
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-wide">GestActifs</span>
      </div>

      <div className="text-sm text-slate-300 font-medium dark:text-black transition-colors">
        Université Oran 1 — Gestion des Actifs
      </div>


    </nav>
  )
}

export default Navbar