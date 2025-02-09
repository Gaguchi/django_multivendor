import { useEffect } from 'react'
import Navbar from './Navbar'
import NavbarMobile from './NavbarMobile'
import Footer from './Footer'

export default function Layout({ children }) {
  useEffect(() => {
    // Initialize plugins after component mounts
    if (window.jQuery) {
      const $ = window.jQuery
      // Re-initialize any required jQuery plugins
      if ($.fn.owlCarousel) {
        $('.owl-carousel').owlCarousel()
      }
      // Add other plugin initializations as needed
    }
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      {children}
      <Footer />
      <NavbarMobile />
    </div>
  )
}
