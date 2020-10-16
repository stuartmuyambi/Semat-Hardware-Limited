// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// cart
let cart = [];

// buttons
let buttonsDOM = [];


// getting the products
class Products {
    async getProducts() {
        try {
            // adding the path to the products page
            let result = await fetch('../products.json'); // added semi colon
            let data = await result.json();


            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });

            return products;
        } catch (error) {
            console.log(errors);
        }
    }
}

// display products
class UI {
    displayProducts(products) {
        let result = "";
        products.forEach((product) => {
            result += ` 
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img 
                    src=${product.image} 
                    alt="Product image" 
                    class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i> 
                    add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>UGX ${product.price}</h4>
            </article>
            `;
        });

        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        // this will turn the buttons into arrays
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find((item) => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }

            button.addEventListener("click", (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get products from products
                let cartItem = { ...Storage.getProduct(id), amount: 1 };

                // add product to the cart
                cart = [...cart, cartItem];

                // save cart in local storage
                Storage.saveCart(cart);

                // set cart values
                this.setCartValues(cart);

                // display cart items
                this.addCartItem(cartItem);

                // show the cart
                this.showCart();
            });
        });
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `<img src=${item.image} alt="product image">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>UGX${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>
                        <svg class="trash-remove" version="1.1" id="Layer_2_1_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
                            <g>
                                <path fill="var(--trash-remove)" d="M53.1,8.4h-10c-0.6-4.7-4.4-8.3-9.4-8.3h-3.1c-5,0-8.9,3.6-9.4,8.3H10.9C8.7,8.4,7,10.1,7,12.3l2.5,41.7c0.3,5.6,5,10,10.6,10h23.6c5.6,0,10.3-4.2,10.8-10L57,12.3C57,10.1,55.3,8.4,53.1,8.4z M30.6,5.6h3.1c1.7,0,3.1,1.1,3.6,2.8H26.7C27.3,6.7,28.7,5.6,30.6,5.6z M48.9,53.7c-0.3,2.8-2.5,4.7-5.3,4.7H20.1c-2.8,0-5-1.9-5-4.7l-2.2-39.7h38.6L48.9,53.7z"/>
                                <path fill="var(--trash-remove)" d="M37.6,27.8v13.9c0,1.7,1.1,2.8,2.8,2.8s2.8-1.1,2.8-2.8V27.8c0-1.7-1.1-2.8-2.8-2.8S37.6,26.2,37.6,27.8z"/>
                                <path fill="var(--trash-remove)" d="M23.7,25.1c-1.7,0-2.8,1.1-2.8,2.8v13.9c0,1.7,1.1,2.8,2.8,2.8c1.7,0,2.8-1.1,2.8-2.8V27.8C26.4,26.2,25.3,25.1,23.7,25.1z"/>
                                <path fill="var(--trash-remove)" d="M32,22.3c-1.7,0-2.8,1.1-2.8,2.8v19.4c0,1.7,1.1,2.8,2.8,2.8s2.8-1.1,2.8-2.8V25.1C34.8,23.4,33.7,22.3,32,22.3z"/>
                            </g>
                        </svg>
                        remove</span>
                    </div>
                    <div class="cart-controls">
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>
                    </div>`;
        cartContent.appendChild(div);
    }

    showCart() {
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
    }

    populateCart(cart) {
        cart.forEach((item) => this.addCartItem(item));
    }

    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }

    cartLogic() {
        // Clear cart button
        clearCartBtn.addEventListener("click", () => {
            this.clearCart();
        });

        // cart functionality
        cartContent.addEventListener("click", (event) => {
            if (event.target.classList.contains("remove-item")) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find((item) => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find((item) => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });


    }

    clearCart() {
        let cartItems = cart.map(item => item.id);
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
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find((product) => product.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem("cart") ?
            JSON.parse(localStorage.getItem("cart")) :
            [];
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    // setup application
    ui.setupAPP();
    // get all products

    products
        .getProducts()
        .then((products) => {
            ui.displayProducts(products);
            Storage.saveProducts(products);
        })
        .then(() => {
            ui.getBagButtons();
            ui.cartLogic();
        });
});