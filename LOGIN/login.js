


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector(".loginForm")
    const emailInp = document.querySelector(".email")
    const passwordInp = document.querySelector(".password")



    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault()
        let user = {
            email: emailInp.value.trim(),
            password: passwordInp.value.trim()
        }

        try {
            const response = await axios.post('http://localhost:8484/users/login', user)
            const token = response.data

            if (token) {
                localStorage.setItem('token', token)
                window.location.href = '/PRODUCT/public/product.html'
            }
        } catch (err) {
            console.error("Error during login:", err)
        }
    })

    function tokenControlUI() {
        let token = localStorage.getItem("token")
        console.log('Token in localStorage:', token)
        if (token) {
            window.location.href = "/PRODUCT/public/product.html"
        }
    }

   
    tokenControlUI()
})




