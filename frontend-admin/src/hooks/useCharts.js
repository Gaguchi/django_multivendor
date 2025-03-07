import { useEffect } from 'react';

/**
 * Custom hook to initialize charts
 * @returns {void}
 */
export const useChartInitialization = () => {
  useEffect(() => {
    console.log("Chart initialization hook triggered");
    
    // Wait for DOM to fully render before initializing charts
    const initTimeout = setTimeout(() => {
      initializeAllCharts();
    }, 500);
    
    // Cleanup function
    return () => {
      clearTimeout(initTimeout);
    };
  }, []); // Empty dependency array means this runs once when component mounts
};

/**
 * Initialize all chart types
 */
const initializeAllCharts = () => {
  console.log("Initializing all charts...");
  
  // Check if chart elements exist
  const elements = {
    lineCharts: Array.from({length: 7}, (_, i) => document.getElementById(`line-chart-${i+1}`)),
    morrisDonut: document.getElementById('morris-donut-1'),
    vectorMap: document.getElementById('usa-vectormap')
  };
  
  console.log("Chart elements status:", {
    lineChartsFound: elements.lineCharts.filter(Boolean).length,
    morrisDonutFound: !!elements.morrisDonut,
    vectorMapFound: !!elements.vectorMap
  });
  
  // Initialize ApexCharts
  initializeApexCharts(elements.lineCharts);
  
  // Initialize Morris charts
  if (elements.morrisDonut) {
    initializeMorrisCharts(elements.morrisDonut);
  }
  
  // Initialize Vector Map
  if (elements.vectorMap) {
    initializeVectorMap(elements.vectorMap);
  }
};

/**
 * Initialize ApexCharts
 */
const initializeApexCharts = (lineChartElements) => {
  if (typeof ApexCharts === 'undefined') {
    console.error("ApexCharts not loaded");
    return;
  }
  
  // Initialize each line chart that exists in the DOM
  lineChartElements.forEach((element, index) => {
    if (!element) return;
    
    const chartId = `line-chart-${index + 1}`;
    console.log(`Initializing ${chartId}`);
    
    try {
      // Clear any existing chart instance
      const chartInstance = document.querySelector(`#${chartId} .apexcharts-canvas`);
      if (chartInstance) {
        console.log(`Removing existing chart instance for ${chartId}`);
        chartInstance.remove();
      }
      
      // Create chart options based on chart number
      let options;
      switch(index + 1) {
        case 1:
          options = getLineChart1Options();
          break;
        case 2:
          options = getLineChart2Options();
          break;
        case 3:
          options = getLineChart3Options();
          break;
        case 4:
          options = getLineChart4Options();
          break;
        case 7:
          options = getLineChart7Options();
          break;
        default:
          console.warn(`No configuration for ${chartId}`);
          return;
      }
      
      // Create new chart
      if (options) {
        const chart = new ApexCharts(element, options);
        chart.render();
        console.log(`${chartId} rendered successfully`);
      }
    } catch (error) {
      console.error(`Error initializing ${chartId}:`, error);
    }
  });
};

/**
 * Initialize Morris charts
 */
const initializeMorrisCharts = (element) => {
  if (typeof Morris === 'undefined') {
    console.error("Morris not loaded");
    return;
  }
  
  try {
    // Clear existing chart
    element.innerHTML = '';
    
    // Create new chart
    Morris.Donut({
      element: 'morris-donut-1',
      data: [
        {label: "Social Media", value: 50},
        {label: "Website", value: 30},
        {label: "Store", value: 20}
      ],
      resize: true,
      colors: ['#8F77F3', '#22C55E', '#2377FC']
    });
    
    console.log("Morris donut chart initialized successfully");
  } catch (error) {
    console.error("Error initializing Morris chart:", error);
  }
};

/**
 * Initialize Vector Map
 */
const initializeVectorMap = (element) => {
  if (typeof $ === 'undefined' || !$.fn.vectorMap) {
    console.error("jQuery or jVectorMap not loaded");
    return;
  }
  
  try {
    // Clear existing map
    $(element).empty();
    
    // Create new map
    $(element).vectorMap({
      map: 'us_lcc',
      backgroundColor: 'transparent',
      regionStyle: {
        initial: {
          fill: '#8F77F3'
        }
      }
    });
    
    console.log("Vector map initialized successfully");
  } catch (error) {
    console.error("Error initializing vector map:", error);
  }
};

// Chart options functions
const getLineChart1Options = () => ({
  series: [{
    name: 'Income',
    data: [31, 40, 28, 51, 42, 82, 56]
  }],
  chart: {
    height: 230,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  colors: ['#22C55E'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  yaxis: {
    show: false
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    axisBorder: {
      show: false
    }
  },
  grid: {
    show: false
  },
  tooltip: {
    enabled: true
  }
});

const getLineChart2Options = () => ({
  series: [{
    name: 'Orders',
    data: [31, 40, 28, 51, 42, 109, 100]
  }],
  chart: {
    height: 230,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  colors: ['#FF5200'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  yaxis: {
    show: false
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    axisBorder: {
      show: false
    }
  },
  grid: {
    show: false
  },
  tooltip: {
    enabled: true
  }
});

const getLineChart3Options = () => ({
  series: [{
    name: 'Customers',
    data: [31, 40, 28, 51, 42, 109, 100]
  }],
  chart: {
    height: 230,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  colors: ['#8F77F3'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  yaxis: {
    show: false
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    axisBorder: {
      show: false
    }
  },
  grid: {
    show: false
  },
  tooltip: {
    enabled: true
  }
});

const getLineChart4Options = () => ({
  series: [{
    name: 'Balance',
    data: [31, 40, 28, 51, 42, 109, 100]
  }],
  chart: {
    height: 230,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  colors: ['#2377FC'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  yaxis: {
    show: false
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    axisBorder: {
      show: false
    }
  },
  grid: {
    show: false
  },
  tooltip: {
    enabled: true
  }
});

const getLineChart7Options = () => ({
    series: [{
            name: 'Revenue',
            type: 'column',
            data: [51, 40, 58, 51, 42, 89, 80, 51, 60, 78, 81, 92]
          }, {
            name: 'Order',
            type: 'line',
            data: [31, 32, 45, 32, 34, 52, 41, 31, 40, 28, 51, 42]
          }],
          chart: {
            height: 404,
            type: 'line',
            stacked: false,
            toolbar: {
              show: false,
            },
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 10,
              animateGradually: {
                  enabled: true,
                  delay: 10
              },
              dynamicAnimation: {
                  enabled: true,
                  speed: 10
              }
            }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 5,
              borderRadiusApplication: 'end', // 'around', 'end'
              borderRadiusWhenStacked: 'last', // 'all', 'last'
              columnWidth: '20px'
            }
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false,
          },
          colors: ['#FF7433', '#8F77F3'],
          stroke: {
            width: [0, 3],
            curve: 'smooth'
          },
          xaxis: {
            labels: {
              style: {
                colors: '#95989D',
              },
            },
            tooltip: {
              enabled: false
            },
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          },
          responsive: [{
            breakpoint: 991,
            options: {
              chart: {
                height: 300
              },
            }
          }],
          yaxis: {
            show: false,
          },
          tooltip: {
            y: {
              title: {
                formatter: function (e) {
                  return e;
                },
              },
            },
          },
});
