const customerId = localStorage.getItem('customerId');

const customer_name = document.querySelector("#customer-name")
const customer_email = document.querySelector("#customer-email")
const customer_phone = document.querySelector("#customer-phone")
const customer_address = document.querySelector("#customer-address")


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

showCustomerInfo()
