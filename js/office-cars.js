// Sample car data (in a real application, this would come from a database)
const carsData = {
    cairo: [
        {
            id: 1,
            name: 'Toyota Camry',
            year: 2023,
            image: 'https://via.placeholder.com/300x200',
            status: 'available',
            mileage: '15,000',
            transmission: 'Automatic',
            fuelType: 'Petrol',
            pricePerDay: 75
        },
        // Add more cars for Cairo
    ],
    // Add more offices and their cars
};

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const office = urlParams.get('office');
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    const carsGrid = document.querySelector('.cars-grid');

    // Update page title with office name
    updatePageTitle(office);

    // Load cars for the selected office
    loadCars(office);

    // Handle search functionality
    searchInput.addEventListener('input', function(e) {
        filterCars();
    });

    // Handle filter changes
    filterSelect.addEventListener('change', function(e) {
        filterCars();
    });

    function updatePageTitle(office) {
        const officeTitle = document.getElementById('office-title');
        if (office) {
            const officeName = office.charAt(0).toUpperCase() + office.slice(1).replace('-', ' ');
            officeTitle.textContent = `Available Cars - ${officeName} Office`;
        }
    }

    function loadCars(office) {
        // In a real application, this would fetch data from a server
        const cars = carsData[office] || [];
        renderCars(cars);
    }

    function renderCars(cars) {
        carsGrid.innerHTML = cars.map(car => createCarCard(car)).join('');
        addCarCardListeners();
    }

    function createCarCard(car) {
        return `
            <div class="car-card" data-car-id="${car.id}">
                <img src="${car.image}" alt="${car.name}" class="car-image">
                <span class="car-status status-${car.status}">${car.status.charAt(0).toUpperCase() + car.status.slice(1)}</span>
                <h2 class="car-name">${car.name} ${car.year}</h2>
                <p class="car-details">
                    <strong>Year:</strong> ${car.year}<br>
                    <strong>Mileage:</strong> ${car.mileage} km<br>
                    <strong>Transmission:</strong> ${car.transmission}<br>
                    <strong>Fuel Type:</strong> ${car.fuelType}
                </p>
                <p class="car-price">$${car.pricePerDay}/day</p>
                <button class="reserve-button" ${car.status !== 'available' ? 'disabled' : ''}">
                    ${getButtonText(car.status)}
                </button>
            </div>
        `;
    }

    function getButtonText(status) {
        switch(status) {
            case 'available': return 'Reserve Now';
            case 'rented': return 'Currently Rented';
            case 'maintenance': return 'Under Maintenance';
            default: return 'Not Available';
        }
    }

    function filterCars() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;
        const carCards = document.querySelectorAll('.car-card');

        carCards.forEach(card => {
            const carName = card.querySelector('.car-name').textContent.toLowerCase();
            const carDetails = card.querySelector('.car-details').textContent.toLowerCase();
            const carStatus = card.querySelector('.car-status').textContent.toLowerCase();
            const carPrice = parseFloat(card.querySelector('.car-price').textContent.replace(/[^0-9.]/g, ''));

            let showCard = carName.includes(searchTerm) || carDetails.includes(searchTerm);

            // Apply additional filters
            if (showCard && filterValue !== 'all') {
                switch(filterValue) {
                    case 'available':
                        showCard = carStatus === 'available';
                        break;
                    case 'price-low':
                        // Sort will be handled separately
                        break;
                    case 'price-high':
                        // Sort will be handled separately
                        break;
                    case 'year-new':
                        // Sort will be handled separately
                        break;
                }
            }

            card.style.display = showCard ? 'block' : 'none';
        });

        // Handle sorting
        if (['price-low', 'price-high', 'year-new'].includes(filterValue)) {
            sortCars(filterValue);
        }
    }

    function sortCars(sortType) {
        const carCards = Array.from(document.querySelectorAll('.car-card'));
        
        carCards.sort((a, b) => {
            switch(sortType) {
                case 'price-low':
                    return getPriceFromCard(a) - getPriceFromCard(b);
                case 'price-high':
                    return getPriceFromCard(b) - getPriceFromCard(a);
                case 'year-new':
                    return getYearFromCard(b) - getYearFromCard(a);
                default:
                    return 0;
            }
        });

        // Reorder cards in the DOM
        carCards.forEach(card => carsGrid.appendChild(card));
    }

    function getPriceFromCard(card) {
        return parseFloat(card.querySelector('.car-price').textContent.replace(/[^0-9.]/g, ''));
    }

    function getYearFromCard(card) {
        return parseInt(card.querySelector('.car-name').textContent.match(/\d{4}/)[0]);
    }

    function addCarCardListeners() {
        const reserveButtons = document.querySelectorAll('.reserve-button');
        
        reserveButtons.forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', function(e) {
                    const carCard = e.target.closest('.car-card');
                    const carId = carCard.dataset.carId;
                    handleReservation(carId);
                });
            }
        });
    }

    function handleReservation(carId) {
        // In a real application, this would handle the reservation process
        alert(`Reservation process started for car ID: ${carId}`);
        // Here you would typically:
        // 1. Show a reservation form
        // 2. Collect user details
        // 3. Process the reservation
        // 4. Update the UI
    }
});
