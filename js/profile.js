const customerId = localStorage.getItem('customerId');

const customer_name = document.querySelector("#customer-name")
const customer_email = document.querySelector("#customer-email")
const customer_phone = document.querySelector("#customer-phone")
const customer_address = document.querySelector("#customer-address")
const carsContainer = document.querySelector(".cars-container");

async function getCustomerInfo() {
    const response = await fetch('/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId
      })});
  
      const customerInfo = await response.json();
      return customerInfo[0];
  }

async function showCustomerInfo() {
    if (!customerId || customerId === "undefined") {
      customer_name.textContent = "Guest";
      return;
    }
    const customerInfo = await getCustomerInfo();
    customer_name.textContent = customerInfo["name"];
    customer_email.textContent = customerInfo["email"];
    customer_phone.textContent = customerInfo["phone"];
    customer_address.textContent = customerInfo["address"];

}

async function getCustomerCars() {
  res = await fetch("/customerCars", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId
    })
  });
  cars = await res.json()
  return cars
}


function createCarElement(model_name, price, office, reservation_id) {
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
    button.textContent = "Return car";
    button.onclick = () => cancelReservation(reservation_id);
    inner_container_div.appendChild(h2);
    inner_container_div.appendChild(button);

    outer_container_div.appendChild(inner_container_div);
    return outer_container_div;
}

async function showCustomerCars(cars = null) {
  carsContainer.innerHTML = "";
  if (cars === null) {
      cars = await getCustomerCars();   
  }
  cars.forEach(car => {
      const carElement = createCarElement(car.model, car.price, car.office, car.reservation_id);
      carsContainer.appendChild(carElement);
  });
}

async function cancelReservation(reservation_id) {
  try {
    const confirmation = confirm("Are you sure you would like to return this car?");
    if (!confirmation) return;
    await fetch('/returnCar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservation_id
      })
    });
      
    alert("Car returned successfully");
    location.reload();
  }
  catch (error) {
    alert("an error occured while returning the car");
  }
}

showCustomerInfo();
showCustomerCars();
