import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-20 sm:max-w-7xl sm:px-6">
        
        {/* Logo */}
        <div
          className="text-2xl font-bold tracking-[0.2em] text-yellow-500 sm:text-3xl"
        >
          TCS
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 p-2">
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            Marketplace
          </NavLink>

          <NavLink
            to="/my-cards"
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            My Cards
          </NavLink>


          <NavLink
            to="/create-card"
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            Create
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Balance - hidden on very small screens */}
          {/*<div className="hidden sm:flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
            12.45 USDC
          </div>*/}

          {/* Avatar */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-sm font-bold text-slate-950 transition hover:scale-105 sm:h-11 sm:w-11">
            CC
          </button>

          {/* Mobile Menu Button */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 md:hidden">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t border-slate-800 bg-slate-900 md:hidden">
        <div className="flex flex-col gap-2 px-4 py-4">
          <NavLink
            to="/my-cards"
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            My Cards
          </NavLink>

          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            Marketplace
          </NavLink>

          <NavLink
            to="/create-card"
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            Create
          </NavLink>

          {/* Mobile Balance */}
          <div className="mt-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-400 sm:hidden">
            12.45 USDC
          </div>
        </div>
      </div>
    </div>
  );
}