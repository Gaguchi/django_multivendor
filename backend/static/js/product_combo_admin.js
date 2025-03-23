(function($) {
    $(document).ready(function() {
        // Enhance the combo product selection interface
        function enhanceComboProductInterface() {
            // Find the combo product inline forms
            const inlineForms = $('.inline-group:has(.inline-related[id*="vendorproduct_frequently_bought_together"])');
            if (inlineForms.length === 0) return;

            // Add heading for better clarity
            inlineForms.find('h2').text('Frequently Bought Together Products');
            
            // Add informational note
            const infoNote = $('<p class="help">Products that customers often buy together with this product. ' +
                              'These will appear as suggested add-ons or bundles.</p>');
            inlineForms.find('h2').after(infoNote);
            
            // Add search box to filter products
            const searchBox = $('<div class="search-box">' +
                               '<label>Search Products: </label>' +
                               '<input type="text" id="combo-product-search" placeholder="Type to search products...">' +
                               '</div>');
            inlineForms.prepend(searchBox);
            
            // Add search functionality
            $('#combo-product-search').on('keyup', function() {
                const searchText = $(this).val().toLowerCase();
                inlineForms.find('select[id$="-to_vendorproduct"] option').each(function() {
                    const optionText = $(this).text().toLowerCase();
                    const row = $(this).closest('tr');
                    if (optionText.includes(searchText) || searchText === '') {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        }
        
        // Initialize combo product interface enhancements
        enhanceComboProductInterface();
        
        // When a new inline form is added
        $(document).on('formset:added', function() {
            enhanceComboProductInterface();
        });
    });
})(django.jQuery);
