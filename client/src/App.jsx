import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import getUserBalance from "./utils/getUserBalance";

const App = () => {
  // Scroll to top on route change
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    // update user balance on route change 
    // to ensure Navbar balance is always up to date 
    getUserBalance(); 
  }, [pathname])

  return (
    <div className="w-full">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default App
