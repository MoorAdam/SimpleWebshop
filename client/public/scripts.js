let products = null;
let listCarts = [];
const listCart = document.querySelector('.listCart');
const total = document.querySelector('.total');
const quantity = document.querySelector('.totalQuantity');

document.addEventListener('DOMContentLoaded', async function () {
    const openShopping = document.querySelector('.iconCart');
    const closeShopping = document.querySelector('.closeShopping');
    const list = document.querySelector('#product-list');
    const body = document.querySelector('body');


    openShopping.addEventListener('click', () => {
        body.classList.add('active');
    })
    closeShopping.addEventListener('click', () => {
        body.classList.remove('active');
    })

    async function fetchProductData() {
        try {
            const response = await fetch('/api/products/all');
            const data = await response.json();
            products = data.products;
            addDataToHTML();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchProductData();

    function addDataToHTML() {
        list.innerHTML = '';
        products.forEach((product, key) => {
            const newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<h3>${product.name}</h3>
                <img src="/static/public/images/${product.image}">
                    <div class="price">$${product.price}</div>
                    <button onclick="addToCart(${key})">Add To Cart</button>`;

            list.appendChild(newProduct);
        });
    }
    addDataToHTML()

});

function changeQuantity(key, quantity) {
    if (quantity === 0) {
        listCarts.splice(key,1);
    } else {
        listCarts[key].quantity = quantity;
        listCarts[key].price = quantity * products[key].price;
    }
    reloadCart();
}

function reloadCart() {
    listCart.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCarts.forEach((product, key) => {
        totalPrice = totalPrice + product.price;
        count = count + product.quantity;
        if (product != null) {
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
            <div><img src="/static/public/images/${product.image}"/></div>
            <div>${product.name}</div>
            <div>$${product.price.toLocaleString()}</div>
            <div>
                <button onclick="changeQuantity(${key}, ${product.quantity - 1})">-</button>
                <div class="count">${product.quantity}</div>
                <button onclick="changeQuantity(${key}, ${product.quantity + 1})">+</button>
            </div>`;
            listCart.appendChild(newDiv);
        }
    })
    total.innerText = "Checkout ($"+ totalPrice.toLocaleString()+")";
    quantity.innerText = count;
}

function addToCart(key) {
    if (listCarts[key] == null) {
        listCarts[key] = JSON.parse(JSON.stringify(products[key]));
        listCarts[key].quantity = 1;
    }
    reloadCart();
}



