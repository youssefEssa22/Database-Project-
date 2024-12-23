document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
  
    const infoElement = document.querySelector(".info");
  
    if (status === "success") {
      infoElement.textContent = "Logged in successfully, redirecting...";

      setTimeout(() => {
        window.location.href = "../html/Home_Page.html";
      }, 3000);
    } else if (status === "failure") {

      infoElement.textContent = "Login Failed, please make sure you entered the correct email and password.";
    } else {
      infoElement.textContent = "Unknown params";
    }
  });
  