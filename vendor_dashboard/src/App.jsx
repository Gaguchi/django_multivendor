import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './components/OAuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, isVendor } from './utils/auth';
import './assets/css/custom.css'; // Import custom CSS for menu fixes

function App() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    // Set initial theme based on localStorage
    const storedTheme = localStorage.getItem('toggled');
    if (storedTheme === 'dark-theme') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      console.log('App: Initialized with dark theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      console.log('App: Initialized with light theme');
    }
  }, []);
  // Check if user is authenticated and is a vendor
  useEffect(() => {
    const checkAuth = async () => {
      // Import the debug function to check token status
      const { debugTokenStatus } = await import('./utils/auth');
      
      // Debug token status before making auth decisions
      console.log('Checking authentication status');
      debugTokenStatus();
      
      const authenticated = isAuthenticated();
      const vendorStatus = isVendor();
      
      console.log('Authentication check results:');
      console.log('- Is authenticated:', authenticated);
      console.log('- Is vendor:', vendorStatus);
      
      setIsAuthorized(authenticated && vendorStatus);
      setCheckingAuth(false);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    // Only load scripts if they haven't been loaded already
    if (!scriptsLoaded) {
      // Function to check if script is already loaded
      const isScriptLoaded = (src) => {
        return document.querySelector(`script[src="${src}"]`) !== null;
      };
      
      // Function to load a script
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          // Skip if script is already loaded
          if (isScriptLoaded(src)) {
            console.log(`Script ${src} already loaded, skipping...`);
            resolve();
            return;
          }
          
          console.log(`Loading script: ${src}`);
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => {
            console.log(`Script loaded successfully: ${src}`);
            resolve();
          };
          script.onerror = (error) => {
            console.error(`Error loading script ${src}:`, error);
            reject(error);
          };
          document.body.appendChild(script);
        });
      };
      
      // List of scripts to load in correct order with corrected paths
      const scripts = [
        "/js/jquery.min.js",          // jQuery first
        "/js/raphael.min.js",         // Raphael (Morris dependency)
        "/js/morris.min.js",          // Morris library (assuming this is the correct file)
        "/js/bootstrap.min.js",       // Bootstrap
        "/js/bootstrap-select.min.js",// Bootstrap Select
        "/js/zoom.js",                // Zoom
        "/js/morris.js",              // Morris initialization script
        // "/js/jvectormap.min.js",
        // "/js/jvectormap-us-lcc.js",
        // "/js/jvectormap-data.js",
        // "/js/jvectormap.js",
        "/js/apexcharts/apexcharts.js", // ApexCharts
        "/js/switcher.js",            // Switcher
        "/js/theme-settings.js",      // Theme Settings
        "/js/main.js"                 // Main custom script
      ];
      
      // Load scripts sequentially
      async function loadScriptsSequentially() {
        console.log("Starting to load scripts sequentially...");
        for (const scriptSrc of scripts) {
          try {
            await loadScript(scriptSrc);
          } catch (error) {
            console.error(`Error loading script ${scriptSrc}:`, error);
          }
        }
        console.log("All scripts loaded!");
        setScriptsLoaded(true);
      }
      
      loadScriptsSequentially();
    }
  }, [scriptsLoaded]);

  // Handle the global preloader hiding after scripts are loaded
  useEffect(() => {
    if (scriptsLoaded && !checkingAuth) {
      console.log("Attempting to hide global preloader...");
      
      // Find the global preloader element
      const globalPreloader = document.getElementById('global-preload');
      
      if (globalPreloader) {
        // Use fadeOut effect similar to the original main.js logic
        if (window.jQuery) { // Check if jQuery is loaded
          window.jQuery(globalPreloader).fadeOut("slow", function() {
            if (globalPreloader.parentNode) {
              globalPreloader.parentNode.removeChild(globalPreloader);
            }
          });
        } else { // Fallback if jQuery isn't loaded for some reason
          globalPreloader.style.transition = 'opacity 0.5s ease-out';
          globalPreloader.style.opacity = '0';
          setTimeout(() => {
            if (globalPreloader.parentNode) {
              globalPreloader.parentNode.removeChild(globalPreloader);
            }
          }, 500);
        }
        console.log("Global preloader hiding initiated.");
      } else {
        console.warn("Global preloader element not found.");
      }
    }
  }, [scriptsLoaded, checkingAuth]);

  const MainLayout = () => (
    <div id="wrapper">
      <div id="page" className="">
        <div className="layout-wrap">
          {/* Removed the preloader from React component as we're using the global one */}
          <SideMenu />
          <div className="section-content-right">
            <Header />
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="loading-screen">
        <div className="preloading">
          <span></span>
        </div>
        <div style={{ marginTop: '20px', color: '#555' }}>
          Loading application...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthorized ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthorized ? <Navigate to="/" /> : <Register />} 
        />
        <Route 
          path="/auth/callback" 
          element={<OAuthCallback />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
