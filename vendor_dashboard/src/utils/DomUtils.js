/**
 * Checks if all required chart DOM elements are ready
 * @returns {Promise} Resolves when elements are found or rejects after timeout
 */
export const waitForChartElements = () => {
  return new Promise((resolve, reject) => {
    const maxAttempts = 10;
    let attempts = 0;
    
    const checkElements = () => {
      console.log(`Checking for chart elements (attempt ${attempts + 1}/${maxAttempts})...`);
      
      const morrisDonut = document.getElementById('morris-donut-1');
      const lineChart1 = document.getElementById('line-chart-1');
      const vectorMap = document.getElementById('usa-vectormap');
      
      console.log("Morris Donut:", morrisDonut ? "Found" : "Not found");
      console.log("Line Chart 1:", lineChart1 ? "Found" : "Not found");
      console.log("Vector Map:", vectorMap ? "Found" : "Not found");
      
      if (morrisDonut && lineChart1 && vectorMap) {
        console.log("All required chart elements found!");
        resolve({
          morrisDonut,
          lineChart1,
          vectorMap
        });
        return;
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        reject(new Error("Timed out waiting for chart elements"));
        return;
      }
      
      // Try again after a delay
      setTimeout(checkElements, 300);
    };
    
    checkElements();
  });
};

/**
 * Ensures a script is loaded
 * @param {string} src - Script source URL
 * @returns {Promise} Resolves when script is loaded
 */
export const ensureScriptLoaded = (src) => {
  return new Promise((resolve, reject) => {
    // If script is already in document, resolve immediately
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

/**
 * Checks if a global variable is defined
 * @param {string} varName - Global variable name
 * @returns {Promise} Resolves when variable is defined or rejects after timeout
 */
export const waitForGlobal = (varName) => {
  return new Promise((resolve, reject) => {
    const maxAttempts = 10;
    let attempts = 0;
    
    const checkVar = () => {
      if (window[varName]) {
        resolve(window[varName]);
        return;
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        reject(new Error(`Timed out waiting for ${varName}`));
        return;
      }
      
      // Try again after a delay
      setTimeout(checkVar, 300);
    };
    
    checkVar();
  });
};
