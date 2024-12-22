// Sample office data (in a real application, this would come from a database)
const officeData = [
    {
        id: 'cairo',
        name: 'Cairo Office',
        address: '123 Tahrir Square, Downtown Cairo, Egypt',
        phone: '+20 2 1234 5678',
        region: 'Middle East'
    },
    // Add more office data here
];

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const officeCards = document.querySelectorAll('.office-card');

    // Handle search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        officeCards.forEach(card => {
            const officeName = card.querySelector('.office-name').textContent.toLowerCase();
            const officeAddress = card.querySelector('.office-address').textContent.toLowerCase();
            
            // Show/hide cards based on search term
            if (officeName.includes(searchTerm) || officeAddress.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Add click event listeners to office cards
    officeCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent default only if it's not an anchor tag that was clicked
            if (e.target.tagName.toLowerCase() !== 'a') {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            }
        });
    });

    // Function to filter offices by region
    function filterByRegion(region) {
        const regionSections = document.querySelectorAll('.region-label');
        
        regionSections.forEach(section => {
            const regionName = section.textContent;
            const officesInRegion = section.nextElementSibling;
            
            if (region === 'all' || regionName.toLowerCase().includes(region.toLowerCase())) {
                section.style.display = 'block';
                let nextElement = section.nextElementSibling;
                while (nextElement && !nextElement.classList.contains('region-label')) {
                    nextElement.style.display = 'block';
                    nextElement = nextElement.nextElementSibling;
                }
            } else {
                section.style.display = 'none';
                let nextElement = section.nextElementSibling;
                while (nextElement && !nextElement.classList.contains('region-label')) {
                    nextElement.style.display = 'none';
                    nextElement = nextElement.nextElementSibling;
                }
            }
        });
    }

    // Add animation effects
    officeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    });
});
