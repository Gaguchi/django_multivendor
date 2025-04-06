!function($) {
  "use strict";

  var MorrisCharts = function() {};

  MorrisCharts.prototype.createDonutChart = function(element, data, colors) {
    // Check if Morris is available before using it
    if (typeof Morris !== 'undefined') {
      Morris.Donut({
        element: element,
        data: data,
        resize: true,
        colors: colors,
        formatter : function (y, data) { 
          return y
        }
      });
    } else {
      console.error("Morris library is not defined when trying to create Donut chart.");
    }
  },
  
  MorrisCharts.prototype.init = function() {
    // Check if jQuery is available
    if (typeof $ === 'undefined') {
      console.error("jQuery is not defined for Morris init.");
      return;
    }
    
    // Check if Raphael is available (Morris dependency)
    if (typeof Raphael === 'undefined') {
      console.error("Raphael is not defined for Morris init.");
      return;
    }

    var $donutData = [
        {label: "Social Media", value: 3.432},
        {label: "Website", value: 4.432},
        {label: "Store", value: 5.432},
    ];
    // Ensure the target element exists before creating the chart
    if ($('#morris-donut-1').length) {
        this.createDonutChart('morris-donut-1', $donutData, ['#FF7433', '#2377FC', '#8F77F3']);
    } else {
        console.warn("Element #morris-donut-1 not found for chart initialization.");
    }
  },

  $.MorrisCharts = new MorrisCharts, $.MorrisCharts.Constructor = MorrisCharts
}(window.jQuery),

// Wait for the DOM to be ready and ensure jQuery is loaded
(function($) {
  "use strict";
  // Use jQuery's ready function to ensure DOM is loaded
  $(function() {
    console.log("DOM ready, attempting to initialize Morris charts...");
    // Check again if Morris is loaded before initializing
    if (typeof Morris !== 'undefined' && $.MorrisCharts) {
        $.MorrisCharts.init();
        console.log("Morris charts initialized.");
    } else {
        console.error("Morris or $.MorrisCharts not available at DOM ready.");
        // Optional: Retry mechanism or further diagnostics
        // setTimeout(function() { 
        //    if (typeof Morris !== 'undefined' && $.MorrisCharts) $.MorrisCharts.init(); 
        // }, 500); 
    }
  });
}(window.jQuery));