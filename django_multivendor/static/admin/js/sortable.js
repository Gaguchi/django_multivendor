// Removed custom sortable.js as django-admin-sortable2 handles sorting

document.addEventListener('DOMContentLoaded', function() {
    const sortableList = document.querySelector('.sortable-images');
    if (sortableList) {
        const rows = sortableList.querySelectorAll('tr');
        rows.forEach(row => {
            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '⇅';
            const firstTd = row.querySelector('td');
            if (firstTd) {
                firstTd.prepend(dragHandle);
            }
        });

        new Sortable(sortableList.querySelector('tbody'), {
            handle: '.drag-handle',
            animation: 150,
            onEnd: function() {
                // Update position fields
                const rows = sortableList.querySelectorAll('tr');
                rows.forEach((row, index) => {
                    const positionInput = row.querySelector('input[name$="-position"]');
                    if (positionInput) {
                        positionInput.value = index;
                    }
                });
            }
        });
    }
});
