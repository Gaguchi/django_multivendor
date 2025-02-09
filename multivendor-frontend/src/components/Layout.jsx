import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import NavbarMobile from './NavbarMobile'

export default function Layout() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <NavbarMobile />
      {/* Main content area - renders child routes */}
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
