const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

let btns = document.querySelectorAll('.bag-btn');
let cart = [];


// getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// display products
class UI {
    displayProducts(products) {
        let result = ``;
        for (var i = 0; i < products.length; i++){
            result += `
            <article class="product">
            <div class="img-container">
                <img src="${products[i].image}" alt="product" class="product-img">
                <button class="bag-btn" data-id="${products[i].id}">
                <i class="fas fa-shopping-cart"></i>
                add to bag
                </button>
            </div>
            <h3>${products[i].title}</h3>
            <h4>$${products[i].price}</h4>
        </article>`;
        }
        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        // TODO
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal =+ item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText  =itemsTotal;
    };
}


class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        // TODO
    }
    static saveCart(cart) {
        // TODO
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
    });
});
