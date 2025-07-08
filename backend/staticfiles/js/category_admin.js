/**
 * Category Admin JavaScript - Hierarchical View Toggle
 */

(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Add a "Hierarchical View" button to the admin
        if (window.location.pathname.includes('/categories/category/')) {
            addHierarchicalViewButton();
            enhanceHierarchicalDisplay();
        }
    });
    
    function addHierarchicalViewButton() {
        // Check if there are sort parameters in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const sortParam = urlParams.get('o');
        const hasSortParams = sortParam && sortParam.trim() !== '';
        
        if (hasSortParams) {
            // Create hierarchical view button
            const hierarchicalBtn = $('<a>')
                .attr('href', window.location.pathname)
                .addClass('addlink')
                .css({
                    'margin-left': '10px',
                    'background-color': '#417690',
                    'border-color': '#417690',
                    'color': 'white',
                    'padding': '8px 12px',
                    'text-decoration': 'none',
                    'border-radius': '4px'
                })
                .html('🌳 Hierarchical View')
                .attr('title', 'View categories in hierarchical tree order');
                
            // Add the button next to the "Add category" button
            $('.object-tools').append(hierarchicalBtn);
        } else {
            // Show current view indicator
            const viewIndicator = $('<span>')
                .css({
                    'margin-left': '10px',
                    'background-color': '#28a745',
                    'color': 'white',
                    'padding': '8px 12px',
                    'border-radius': '4px',
                    'font-size': '13px'
                })
                .html('🌳 Hierarchical View Active');
                
            $('.object-tools').append(viewIndicator);
        }
    }
    
    // Add styling for better hierarchy visualization
    function enhanceHierarchicalDisplay() {
        // Add hover effects for tree items
        $('.field-get_hierarchical_name a').hover(
            function() {
                $(this).css('background-color', '#f8f9fa');
            },
            function() {
                $(this).css('background-color', 'transparent');
            }
        );
        
        // Add click handler for expanding/collapsing (future enhancement)
        $('.children-indicator').css({
            'font-size': '11px',
            'color': '#666',
            'margin-left': '5px'
        });
    }

})(django.jQuery);
