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

login_form.addEventListener("submit", (e) =>{
  e.preventDefault()
  const email = document.querySelector("#email").value
  const password = document.querySelector("#password").value
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password
    }),
  }).then(response => response.json())
});

register_form.addEventListener("submit", (e)=> {
    e.preventDefault()
    const fname = document.querySelector("#fname").value
    const lname = document.querySelector("#lname").value
    const email = document.querySelector("#register_email").value
    const password = document.querySelector("#register_password").value
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
        }),
      }).then(response => response.json())
});

