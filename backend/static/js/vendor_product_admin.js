/**
 * Vendor Product Admin JavaScript
 * Enhanced category dropdown functionality with search and visual improvements
 */

(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Initialize category dropdown enhancements
        initializeCategoryDropdown();
        
        // Initialize attribute management
        initializeAttributeManagement();
        
        // Initialize product combo functionality
        initializeProductCombos();
    });
    
    function initializeCategoryDropdown() {
        const categoryField = $('#id_category_field, #id_category');
        
        if (categoryField.length) {
            // Add search functionality to category dropdown
            addCategorySearch(categoryField);
            
            // Enhance dropdown styling
            enhanceCategoryDropdown(categoryField);
            
            // Add category change handler
            categoryField.on('change', handleCategoryChange);
        }
    }
    
    function addCategorySearch(categoryField) {
        // Create search input
        const searchInput = $('<input>', {
            type: 'text',
            placeholder: 'Search categories...',
            class: 'category-search',
            style: 'margin-bottom: 5px; padding: 5px; width: 100%; border: 1px solid #ccc; border-radius: 3px;'
        });
        
        // Insert search input before the dropdown
        categoryField.before(searchInput);
        
        // Store original options
        const originalOptions = categoryField.find('option').clone();
        
        // Search functionality
        searchInput.on('input', function() {
            const searchTerm = $(this).val().toLowerCase();
            
            if (searchTerm === '') {
                // Show all options
                categoryField.empty().append(originalOptions.clone());
            } else {
                // Filter options
                const filteredOptions = originalOptions.filter(function() {
                    const optionText = $(this).text().toLowerCase();
                    return optionText.includes(searchTerm);
                });
                
                categoryField.empty().append(filteredOptions);
            }
        });
    }
    
    function enhanceCategoryDropdown(categoryField) {
        // Add visual enhancements
        categoryField.addClass('enhanced-category-dropdown');
        
        // Wrap in a styled container
        const wrapper = $('<div>', {
            class: 'category-dropdown-wrapper',
            style: 'position: relative; margin-bottom: 10px;'
        });
        
        categoryField.wrap(wrapper);
        
        // Add category info display
        const infoDiv = $('<div>', {
            class: 'category-info',
            style: 'margin-top: 5px; padding: 8px; background: #f8f9fa; border-radius: 3px; font-size: 12px; color: #666; display: none;'
        });
        
        categoryField.after(infoDiv);
        
        // Show category info on selection
        categoryField.on('change', function() {
            const selectedOption = $(this).find('option:selected');
            const optionText = selectedOption.text();
            
            if (optionText && optionText !== '--- Select Category ---') {
                // Extract category info from the option text
                const matches = optionText.match(/\(([^)]+)\)$/);
                const info = matches ? matches[1] : 'Category selected';
                
                infoDiv.html(`
                    <i class="fas fa-info-circle"></i> 
                    <strong>Selected:</strong> ${optionText.replace(/[📁├─│\s]+/, '').split('(')[0].trim()}
                    <br>
                    <strong>Info:</strong> ${info}
                `).show();
            } else {
                infoDiv.hide();
            }
        });
    }
    
    function handleCategoryChange() {
        const categoryId = $(this).val();
        
        if (categoryId) {
            // Show loading indicator for attributes
            showAttributeLoading();
            
            // Update attributes based on category (if applicable)
            setTimeout(() => {
                hideAttributeLoading();
                showCategoryMessage(categoryId);
            }, 500);
        }
    }
    
    function showCategoryMessage(categoryId) {
        // Create a temporary success message
        const message = $('<div>', {
            class: 'category-success-message',
            style: 'background: #d4edda; color: #155724; padding: 8px; border-radius: 3px; margin: 10px 0; border: 1px solid #c3e6cb;',
            html: '<i class="fas fa-check"></i> Category selected! Relevant attributes will be available after saving.'
        });
        
        $('.category-info').after(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            message.fadeOut(() => message.remove());
        }, 3000);
    }
    
    function showAttributeLoading() {
        $('.product-attributes-inline').prepend(
            '<div class="attribute-loading" style="text-align: center; padding: 20px; color: #666;">' +
            '<i class="fas fa-spinner fa-spin"></i> Updating attributes...' +
            '</div>'
        );
    }
    
    function hideAttributeLoading() {
        $('.attribute-loading').remove();
    }
    
    function initializeAttributeManagement() {
        // Add attribute management buttons if they don't exist
        const categoryField = $('#id_category_field, #id_category');
        
        if (categoryField.length) {
            const buttonContainer = $('<div>', {
                class: 'attribute-management-buttons',
                style: 'margin-top: 10px;'
            });
            
            const addAttributesBtn = $('<button>', {
                type: 'button',
                class: 'btn btn-secondary btn-sm',
                style: 'margin-right: 5px;',
                html: '<i class="fas fa-plus"></i> Auto-Add Attributes',
                click: function(e) {
                    e.preventDefault();
                    if (categoryField.val()) {
                        alert('Attributes will be automatically added when you save the product.');
                    } else {
                        alert('Please select a category first.');
                    }
                }
            });
            
            buttonContainer.append(addAttributesBtn);
            categoryField.closest('.form-row, .field-category').after(buttonContainer);
        }
    }
    
    function initializeProductCombos() {
        // Enhance product combo functionality
        $('.field-frequently_bought_together').on('change', function() {
            const selectedCount = $(this).find('option:selected').length;
            
            if (selectedCount > 0) {
                const message = $('<div>', {
                    class: 'combo-info',
                    style: 'margin-top: 5px; padding: 5px; background: #e7f3ff; border-radius: 3px; font-size: 12px;',
                    text: `${selectedCount} product(s) selected for combo deals`
                });
                
                $(this).siblings('.combo-info').remove();
                $(this).after(message);
            } else {
                $(this).siblings('.combo-info').remove();
            }
        });
    }
    
})(django.jQuery || jQuery || $);
