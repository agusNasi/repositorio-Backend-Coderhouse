const productItem = document.querySelector('.product-item')
const addToCartButton = document.getElementById('add-to-cart-button')
const seeCartButton = document.querySelector('.see-cart-button')

const cartId = seeCartButton.id

const addToCart = async (event) =>{
    const productId = event.target.parentNode.getAttribute('id')
    const amount = event.target.previousElementSibling.children[1].textContent
    await fetch(`/api/carts/${cartId}/product/${productId}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({amount}),
    })
    .then(() => alert('item added to cart'))
    event.target.previousElementSibling.children[1].textContent = 1
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
    const stock = +event.target.parentNode.previousElementSibling.textContent.split(' ')[0]
    const amount = +event.target.previousElementSibling.textContent
    if(amount < stock){
        event.target.previousElementSibling.textContent = amount + 1
    }
}