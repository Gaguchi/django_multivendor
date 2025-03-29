import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideMenu from './componenets/SideMenu';
import Header from './componenets/Header';
import MainContent from './componenets/MainContent';
import Login from './pages/Login';
import OAuthCallback from './components/OAuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/auth';

function App() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

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
          };
          
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
      
      // List of scripts to load
      const scripts = [
        "../js/jquery.min.js",
        "../js/bootstrap.min.js",
        "../js/bootstrap-select.min.js",
        "../js/zoom.js",
        "../js/morris.min.js",
        "../js/raphael.min.js",
        "../js/morris.js",
        "../js/jvectormap.min.js",
        "../js/jvectormap-us-lcc.js",
        "../js/jvectormap-data.js",
        "../js/jvectormap.js",
        "../js/apexcharts/apexcharts.js",
        "../js/switcher.js",
        "../js/theme-settings.js",
        "../js/main.js"
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
    
    // Clean up function
    return () => {
      // No need to remove scripts on component unmount as they might be needed globally
    };
  }, [scriptsLoaded]);

  const MainLayout = () => (
    <div id="wrapper">
      <div id="page" className="">
        <div className="layout-wrap">
          <div id="preload" className="preload-container">
            <div className="preloading">
              <span />
            </div>
          </div>
          <SideMenu />
          <div className="section-content-right">
            <Header />
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
