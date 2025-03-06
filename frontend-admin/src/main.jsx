import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create a global function to re-initialize charts
window.initApexCharts = function() {
  // Check if the chart initialization functions exist
  if (typeof initlinechart1 === 'function') initlinechart1();
  if (typeof initlinechart2 === 'function') initlinechart2();
  if (typeof initlinechart3 === 'function') initlinechart3();
  if (typeof initlinechart4 === 'function') initlinechart4();
  if (typeof initlinechart5 === 'function') initlinechart5();
  if (typeof initlinechart6 === 'function') initlinechart6();
  if (typeof initlinechart7 === 'function') initlinechart7();
};

// Create a global function to initialize vector maps
window.initVectorMap = function() {
  if (typeof $ !== 'undefined' && $.fn.vectorMap) {
    $('#usa-vectormap').vectorMap({
      map: 'us_lcc',
      backgroundColor: 'transparent',
      regionStyle: {
        initial: {
          fill: '#8F77F3'
        }
      }
    });
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
