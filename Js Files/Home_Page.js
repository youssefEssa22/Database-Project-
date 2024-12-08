const navbar = document.querySelector("nav");
window.addEventListener("scroll" , () =>
    navbar.classList.toggle("sticky" , window.screenY > 0) 
);

const menu = document.querySelector(".menu");
const toggleMenu = () => menu.classList.toggle("active");

document.querySelector(".menu-btn").addEventListener("click" ,toggleMenu);
document.querySelector(".close-btn").addEventListener("click" ,toggleMenu);

document
    .querySelectorAll(".menu a")
    .forEach((link) => link.addEventListener("click" , toggleMenu));


// const sr = ScroRevall ({
//     origin :"bottom",
//     distance : "40px",
//     duration : 1000,
//     dealy : 400,
//     easing : "ease-in-out" 
// });

// sr.revall(".hero-headlines" , {origin : "left"});
// sr.revall(".hero-page img" , {origin : "right"});
// sr.revall(".about");

// sr.revall(".about h1" , {delay : "500"});
// sr.revall(".about p" , {delay : "700"});
// sr.revall(".about-info" , {delay : "1000"});
// sr.revall(".collection h1");



async function getCars() {
    res = await fetch("/cars")
    cars = await res.json()
    return cars
}

function createCarElement(model_name, price) {
    outer_container_div = document.createElement("div");
    outer_container_div.classList.add('collection-car-item');
    car_img = document.createElement("img");
    console.log(car_img)
    car_img.setAttribute("alt", "Car image");
    car_img.setAttribute("src", "../Photos/Screenshot (166).png");
    outer_container_div.appendChild(car_img)

    inner_container_div = document.createElement("div");
    inner_container_div.classList.add('car-info-container');
    info_container_div = document.createElement("div");
    info_container_div.classList.add('car-info');
    price_div = document.createElement("div");
    
    price_div.classList.add('car-price');
    const h5 = document.createElement('h5');
    h5.textContent = '$' + price;
    const h6 = document.createElement('h6');
    h6.textContent = '/Day';

    price_div.appendChild(h5);
    price_div.appendChild(h6);

    const car_location_div = document.createElement('div');
    car_location_div.classList.add('car-location');

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-location-dot');

    const locationText = document.createElement('h6');
    locationText.textContent = 'California';

    car_location_div.appendChild(icon)
    car_location_div.appendChild(locationText)

    info_container_div.appendChild(price_div)
    info_container_div.appendChild(car_location_div)
    inner_container_div.appendChild(info_container_div)

    const h2 = document.createElement('h2');
    h2.textContent = model_name;

    const button = document.createElement('button');
    button.classList.add('btn-2', 'btn-car');

    const buttonText = document.createElement('p');
    buttonText.textContent = 'Buy Now';
    button.appendChild(buttonText)
    const phoneIcon = document.createElement('i');
    phoneIcon.classList.add('fa-solid', 'fa-phone');

    inner_container_div.appendChild(h2)
    inner_container_div.appendChild(button)
    inner_container_div.appendChild(phoneIcon)

    outer_container_div.appendChild(inner_container_div)
    return outer_container_div
}

async function showCars() {
    container = document.querySelector("#collection");
    // car_cont = createCarElement("test", 5000)
    // container.appendChild(car_cont)

    cars = await getCars();
    await cars.forEach(car => {
        car_model = car["model"]
        car_price = car["price"]
        car_cont = createCarElement(car_model, car_price)
        container.appendChild(car_cont)
    })
}
console.log("t")
showCars()