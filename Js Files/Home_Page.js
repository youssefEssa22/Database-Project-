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


const sr = ScroRevall ({
    origin :"bottom",
    distance : "40px",
    duration : 1000,
    dealy : 400,
    easing : "ease-in-out" 
});

sr.revall(".hero-headlines" , {origin : "left"});
sr.revall(".hero-page img" , {origin : "right"});
sr.revall(".about");

sr.revall(".about h1" , {delay : "500"});
sr.revall(".about p" , {delay : "700"});
sr.revall(".about-info" , {delay : "1000"});
sr.revall(".collection h1");

