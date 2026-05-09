import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import HamburgerIcon from '../assets/HamburgerIcon'
import { useEffect } from 'react'
import backendURL from '../constants/url-constants'

export default function Navbar() {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))
  const profileIconLetter = user.name[0].toUpperCase()
  const [balance, setBalance] = useState(user.balance || '0')


  // Listen for and handle balance update
  useEffect(() => {
    console.log("entered navbar useEffect, current balance:", balance)
    const handleBalanceUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'))
      setBalance(updatedUser.balance)
    }
    window.addEventListener('balanceUpdated', handleBalanceUpdate)
    return () => window.removeEventListener('balanceUpdated', handleBalanceUpdate)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleMobileMenu = () => setShowMobileMenu(!showMobileMenu)

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-yellow-500 text-slate-950'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-yellow-500 text-slate-950'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  return (
    <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-20 sm:max-w-7xl sm:px-6">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-[0.2em] text-yellow-500 transition-opacity duration-200 hover:opacity-80 sm:text-3xl">
          TCS
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 p-2">
          <NavLink to="/marketplace" className={navLinkClass}>Marketplace</NavLink>
          <NavLink to="/my-cards" className={navLinkClass}>My Cards</NavLink>
          <NavLink to="/create-card" className={navLinkClass}>Create</NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Balance */}
          <div className="hidden md:flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
            ${parseFloat(balance).toFixed(2)}
          </div>
          {/* Avatar - Desktop only */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-sm font-bold text-slate-950 transition-all duration-200 hover:scale-105 sm:h-11 sm:w-11">
              {profileIconLetter}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-700 bg-slate-800 shadow-lg animate-[slide-down_0.15s_ease-out_forwards]">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors duration-150 rounded-b-lg">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenu}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:bg-slate-800 md:hidden ${
              showMobileMenu ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}>
            <HamburgerIcon />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="mobile-menu-enter fixed w-full z-40 border-t border-slate-800 bg-slate-900 md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            <NavLink to="/marketplace" className={mobileNavLinkClass} onClick={() => setShowMobileMenu(false)}>Marketplace</NavLink>
            <NavLink to="/my-cards" className={mobileNavLinkClass} onClick={() => setShowMobileMenu(false)}>My Cards</NavLink>
            <NavLink to="/create-card" className={mobileNavLinkClass} onClick={() => setShowMobileMenu(false)}>Create</NavLink>

            {/* Balance */}
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-400">
              Balance: ${parseFloat(balance).toFixed(2)}
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-xl bg-red-600/20 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-600/30">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}