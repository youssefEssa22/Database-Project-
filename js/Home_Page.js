async function getCars() {
    res = await fetch("/cars")
    cars = await res.json()
    return cars
}

async function searchCars(startDate, endDate, model, office, orderBy) {
    try {
        const queryParams = new URLSearchParams();

        if (startDate) queryParams.append("start_date", startDate);
        if (endDate) queryParams.append("end_date", endDate);
        if (model) queryParams.append("model", model);
        if (office) queryParams.append("office", office);
        if (orderBy) queryParams.append("order_by", orderBy);

        const res = await fetch(`/searchCars?${queryParams.toString()}`);
        if (!res.ok) {
            throw new Error("Failed to fetch cars.");
        }
        const cars = await res.json();
        return cars;
    } catch (error) {
        console.error(error);
        alert("Could not load cars for the selected filters.");
        return [];
    }
}

document.querySelector("#search-cars-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const startDate = document.querySelector("#start-date").value;
    const endDate = document.querySelector("#end-date").value;
    const model = document.querySelector("#model").value;
    const office = document.querySelector("#office").value;
    const orderBy = document.querySelector("#order-by").value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert("Start date cannot be later than end date.");
        return;
    }

    const cars = await searchCars(startDate, endDate, model, office, orderBy);
    showCars(cars);
});


function createCarElement(model_name, price, office, car_id) {
    const outer_container_div = document.createElement("div");
    outer_container_div.classList.add("collection-car-item");

    const car_img = document.createElement("img");
    car_img.setAttribute("alt", "Car image");
    car_img.setAttribute("src", "../Photos/Screenshot (166).png");
    outer_container_div.appendChild(car_img);

    const inner_container_div = document.createElement("div");
    inner_container_div.classList.add("car-info-container");
    const info_container_div = document.createElement("div");
    info_container_div.classList.add("car-info");

    const price_div = document.createElement("div");
    price_div.classList.add("car-price");
    const h5 = document.createElement("h5");
    h5.textContent = "$" + price;
    const h6 = document.createElement("h6");
    h6.textContent = "/Day";

    price_div.appendChild(h5);
    price_div.appendChild(h6);

    const car_location_div = document.createElement("div");
    car_location_div.classList.add("car-location");

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-location-dot");

    const locationText = document.createElement("h6");
    locationText.textContent = office;

    car_location_div.appendChild(icon);
    car_location_div.appendChild(locationText);

    info_container_div.appendChild(price_div);
    info_container_div.appendChild(car_location_div);
    inner_container_div.appendChild(info_container_div);

    const h2 = document.createElement("h2");
    h2.textContent = model_name;

    const button = document.createElement("button");
    button.classList.add("btn-2", "btn-car");
    button.textContent = "Rent Now";
    button.onclick = () => openRentModal(car_id, price);
    inner_container_div.appendChild(h2);
    inner_container_div.appendChild(button);

    outer_container_div.appendChild(inner_container_div);
    return outer_container_div;
}

function openRentModal(car_id, pricePerDay) {
    const modal = document.getElementById("rent-modal");
    modal.style.display = "flex";

    const carIdInput = document.getElementById("car-id");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const priceDisplay = document.getElementById("price-display");

    carIdInput.value = car_id;
    startDateInput.value = new Date().toISOString().split("T")[0];
    endDateInput.value = new Date().toISOString().split("T")[0];
    priceDisplay.textContent = "Total Price: $" + pricePerDay;

    const calculatePrice = () => {
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);
        const days = Math.max(1, (end - start) / (1000 * 60 * 60 * 24)); // Ensure at least 1 day
        priceDisplay.textContent = `Total Price: $${(days * pricePerDay).toFixed(2)}`;
    };

    startDateInput.onchange = calculatePrice;
    endDateInput.onchange = calculatePrice;

    document.getElementById("close-btn").onclick = () => {
        modal.style.display = "none";
    };

    document.getElementById("rent-form").onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        try {
            const res = await fetch("/rentCar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ car_id, start_date: startDate, end_date: endDate, email }),
            });

            if (res.ok) {
                alert("Car rented successfully!");
                modal.style.display = "none";
            } else {
                alert("Failed to rent the car.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        }
    };
}


async function showCars(cars = null) {
    const container = document.querySelector("#collection");
    container.innerHTML = "";
    if (cars === null) {
        cars = await getCars();   
    }
    cars.forEach(car => {
        const carElement = createCarElement(car.model, car.price, car.office, car.car_id);
        container.appendChild(carElement);
    });
}
console.log("t")
showCars()