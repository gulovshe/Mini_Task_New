const registerInp=document.querySelector("form")
const nameInp=document.querySelector(".name")
const emailInp=document.querySelector(".email")
const passwordInp=document.querySelector(".password")

registerInp.addEventListener("submit",async function(e){
    e.preventDefault()
    let newUser={
        username:nameInp.value.trim(),
        email:emailInp.value.trim(),
        password:passwordInp.value.trim()
    }


try {
    const response = await axios.post('http://localhost:8484/users/register', newUser)
    const token = response.headers['x-token']

    if (token) {
        localStorage.setItem('token', token)
        window.location.href = '/LOGIN/login.html'
    }
} catch (err) {
    console.error(err);
    alert('Registration failed. Please check your inputs.')
}
})

function tokenControlUI(){
    let token=localStorage.getItem("token")
        if(token){
            window.location.href="/LOGIN/login.html"
        }
    
}
tokenControlUI()

