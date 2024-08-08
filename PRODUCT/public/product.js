

async function getdata() {
    try {
        let datas = await axios.get('http://localhost:8484/products', {
            headers: {
                'x-token': localStorage.getItem('token') // Tokeni başlığa əlavə edin
            }
        });
        createcards(datas.data);
    } catch (err) {
        console.error('Error fetching data:', err);
        alert('Failed to fetch data. Please try again.');
    }
}

getdata()


let cards=document.querySelector(".cards")
let addForm=document.querySelector(".add-form")
let nameInp=document.querySelector(".nameInp")
let prInp=document.querySelector(".prInp")
let descInp=document.querySelector(".descInp")


function createcards(products){
    console.log(products)
    cards.innerHTML=""
    products.forEach(datas=> {
        cards.innerHTML+=`<div class="card1">
                        <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22700%22%20height%3D%22300%22%20viewBox%3D%220%200%20700%20300%22%20preserveAspectRatio%3D%22none%22%3E%3C!--%0ASource%20URL%3A%20holder.js%2F700x300%0ACreated%20with%20Holder.js%202.8.0.%0ALearn%20more%20at%20http%3A%2F%2Fholderjs.com%0A(c)%202012-2015%20Ivan%20Malopinsky%20-%20http%3A%2F%2Fimsky.co%0A--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%3C!%5BCDATA%5B%23holder_191213f04b1%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A35pt%20%7D%20%5D%5D%3E%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_191213f04b1%22%3E%3Crect%20width%3D%22700%22%20height%3D%22300%22%20fill%3D%22%23EEEEEE%22%2F%3E%3Cg%3E%3Ctext%20x%3D%22259.1624984741211%22%20y%3D%22165.6%22%3E700x300%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="">                       
                        <div class="content">
                        <span class="span1">${datas.name}</span>
                       
                         <span class="span2">${datas.description}</span>
                        <span class="span3"> $${datas.price}</span>
                        <button data-id=${datas._id} class="deleteBtn"> delete</button>  
                       </div>
                     </div>`
                    })         




document.querySelectorAll('.deleteBtn').forEach(deleteBtn => {
    deleteBtn.addEventListener('click', async function() {
        let id = deleteBtn.getAttribute('data-id')
        try {
            await axios.delete(`http://localhost:8484/products/${id}`, {
                headers: {
                    'x-token': localStorage.getItem('token') // Tokeni başlığa əlavə edin
                }
            });
            getdata()
        } catch (err) {
            console.error('Error deleting product:', err)
            alert('Failed to delete product. Please try again.')
        }
    })
})
}

addForm.addEventListener('submit', async function(event) {
event.preventDefault()
let newProduct = {
    name: nameInp.value.trim(),
    price: prInp.value.trim(),
    description: descInp.value.trim()
}

try {
    await axios.post('http://localhost:8484/products', newProduct, {
        headers: {
            'x-token': localStorage.getItem('token') // Tokeni başlığa əlavə edin
        }
    });
    nameInp.value = '';
    prInp.value = '';
    descInp.value = '';
    getdata();
} catch (err) {
    console.error('Error adding product:', err);
    alert('Failed to add product. Please check your inputs.');
}
})

let logoutBtn = document.querySelector('.Log')
logoutBtn.addEventListener('click', function() {
localStorage.removeItem('token')
window.location.href = '/REGISTER/register.html'
})

function tokenControlUI(){
    let token=localStorage.getItem("token")
        if(!token){
            window.location.href="/REGISTER/register.html"
        }
    
}
tokenControlUI()