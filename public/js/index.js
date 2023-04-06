const productItem = document.querySelector('.product-item')
const addToCartButton = document.getElementById('add-to-cart-button')
const seeCartButton = document.querySelector('.see-cart-button')

const cartId = seeCartButton.id

const addToCart = async (event) =>{
    try {
        const productId = event.target.parentNode.parentNode.getAttribute('id')
        const amount = event.target.previousElementSibling.children[1].textContent
        const addedProduct = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({amount}),
        })
        if (addedProduct.status !== 403){
            alert('item added to cart')
        }else{
            alert("Can't add product to cart")
        }
        event.target.previousElementSibling.children[1].textContent = 1
        
    } catch (error) {
        console.log(error);
    }
}


const seeCart = async (event) =>{
    window.location.href = `/cart/${cartId}`
}

const decreaseAmount = (event) =>{
    const amount = + event.target.nextElementSibling.textContent
    if (amount > 1){
        event.target.nextElementSibling.textContent = amount - 1
    }
}

const increaseAmount = (event) =>{
    const stock = +event.target.parentNode.parentNode.previousElementSibling.textContent.split(' ')[0]
    const amount = +event.target.previousElementSibling.textContent
    if(amount < stock){
        event.target.previousElementSibling.textContent = amount + 1
    }
}