import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default function Layout() {
  const location = useLocation();
  
  // Layout-specific event handlers without jQuery initialization
  useEffect(() => {
    // Make sure jQuery is available
    if (typeof $ === 'undefined') {
      return;
    }
    
    // Handle layout-specific jQuery interactions
    const setupEventHandlers = () => {
      // Mobile menu toggle
      $('.mobile-menu-toggler').on('click', function() {
        $('body').toggleClass('mmenu-active');
      });
      
      // Mobile menu overlay
      $('.mobile-menu-overlay, .mobile-menu-close').on('click', function() {
        $('body').removeClass('mmenu-active');
      });
      
      // Sticky header behavior
      $(window).on('scroll', function() {
        if ($(this).scrollTop() >= 400) {
          $('#scroll-top').addClass('fixed');
        } else {
          $('#scroll-top').removeClass('fixed');
        }
      });
      
      // Scroll to top functionality
      $('#scroll-top').on('click', function() {
        $('html, body').animate({
          scrollTop: 0
        }, 1200);
        return false;
      });
    };
    
    // Run setup once the DOM is ready
    if (document.readyState === 'complete') {
      setupEventHandlers();
    } else {
      window.addEventListener('load', setupEventHandlers);
    }
    
    // Cleanup function
    return () => {
      if (typeof $ !== 'undefined') {
        $('.mobile-menu-toggler').off('click');
        $('.mobile-menu-overlay, .mobile-menu-close').off('click');
        $('#scroll-top').off('click');
        window.removeEventListener('load', setupEventHandlers);
      }
    };
  }, []);
  
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <button id="scroll-top" title="Back to top">
        <i className="icon-angle-up"></i>
      </button>
    </>
  );
}
