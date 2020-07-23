const client = contentful.createClient({
    //this is the space ID. a space is like a project folder in contentful terms
    space: "48t1s0p1dk0p",
    //this is the access token for this space. Normally you get both ID and the token in the contentful web app
    accessToken: "c489fac103563c52ee19ae0debbd4e9a4f2e8a60e9738c9255e4b84099437d7"
});
console.log(client);
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-btn");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-centre");

console.log(btns);
//cart local storage

let cart = []
let buttonsDOM = [];

// getting the product locally ex. json

class Products {
    async getProduct() {
        try {
          //  let contentful = await client.getEntries({content_type:"comfyHouseProducts"})//.then((response) => console.log(response.item)).catch(console.error)
          //  console.log(contentful);

            let result = await fetch('json.json');
            let data = await result.json();

           let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })

            return products;
        } catch (error) {

            console.log(error);
        }
    }
}

//grab element from product and display them and getting from local storage

class UI {
    displayProducts(products) {
        let result = '';
        console.log(products);
        products.forEach(product => {
            result +=
                ` < !--single product-- >
                <article class="product">
                    <div class="img-container">
                        <img src=${product.image} alt="product" class="product-img">
                            <button class="bag-btn" data-id=${product.id}>
                                <i class="fas fa-shopping-cart"></i>
                        add to the bag
                    </button>
                </div>
                        <h3>${product.title}</h3>
                        <h4>$${product.price}</h4>
            </article>
                    <!--eo single product-->`
        });
        productsDOM.innerHTML = result;

    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            console.log(id);
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.diable = true
            }

            button.addEventListener("click", (event) => {
                event, target.innerText = "In Cart";
                event.target.diabled = true;
                // get product from products
                let cartItem = { ...Storage.getProduct(id), amount: 1 };
                console.log(cartItem);
                //add product to the cart
                cart = [...cart, cartItem];
                console.log(cart);
                //save cart in local storage
                Storage.saveCart(cart);


                //set cart value
                this.setCartValue(cart);
                this.setCartValues(cart);
                //display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
            });

        });
    }
    setCartValue(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount
        })
        cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2))
        cartItems.innerHTML = itemsTotal;
        console.log(cartTotal, cartItems);
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `  <img src=${item.image} alt="product" />
<div>
    <h4>${item.title}</h4>
    <h5>${item.price}</h5>
    <span class="remove-item" data-id${item.id}=>remove</span>
</div>
</div>
<i class="fas fa-chevron-up" data-id=${item.id}></i>
<p class="item-amount">${item.amount}</p>
<i class="fas fa-chevron-down"=${item.id}></i>
</div>`;
        cartContent.appendChild(div);
        console.log(cartContent);
    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        carDOM.classList.add('showCart');
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populate(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart)
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        carDOM.classList.remove('showCart');
    }
    cartLogic() {
        //clear cart btn
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        //cart functionality
        cartContent.addEventListener("click", event => {
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;

                cartCotent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
                console.log(removeItem);
            }
            else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;

                console.log(addAmount);

            }
            else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement);
                    this.removeItem(id)
                }
            }
        });
    }
    clearCart() {
        console.log(this);
        let cartItems = cart.map(item => item.id);
        console.log(cartItems);
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);

        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();

    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.diabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart></i>add to cart`;
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => buttonsDOM.dataset.id === id);
    }
}


//local  storage

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));

    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupAPP();
    //get all products
    products.getProduct().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic()
    });
});
