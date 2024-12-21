const loginsec=document.querySelector('.login-section')
const loginlink=document.querySelector('.login-link')
const registerlink=document.querySelector('.register-link')
registerlink.addEventListener('click',()=>{
    loginsec.classList.add('active')
})
loginlink.addEventListener('click',()=>{
    loginsec.classList.remove('active')
})

const register_form = document.querySelector("#register_form")
const login_form = document.querySelector("#login_form")

async function loginUser(email, password) {
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password
    })});

    userInfo = await response.json();
    return userInfo;
}

login_form.addEventListener("submit", async (e) =>{
  e.preventDefault()
  const email = document.querySelector("#login_email").value
  const password = document.querySelector("#login_password").value
  // console.log(email)
  userInfo = await loginUser(email, password)

  customerId = userInfo["customerId"];

  localStorage.setItem('customerId', userInfo["customerId"]);

  console.log(`logged in as customer with id ${customerId}`)
});

register_form.addEventListener("submit", (e)=> {
    e.preventDefault()
    const fname = document.querySelector("#fname").value
    const lname = document.querySelector("#lname").value
    const email = document.querySelector("#register_email").value
    const password = document.querySelector("#register_password").value
    const phone = document.querySelector("#phone").value
    const address = document.querySelector("#address").value
    const name = fname+ ' ' + lname
    console.log(fname, lname, email, password)

    fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          address
        }),
      }).then(response => response.json())
});

