async function getProducts() {
    try {
        //asignamos a variable la peticion a la API
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );

        //conversion de string a arreglo
        const res = await data.json();

        // permite q se guarde datos en el localStorage -solo acepta string
        window.localStorage.setItem("productsApi", JSON.stringify(res));

        //Devolvemos elarreglo
        return res;
    } catch (error) {
        //devuelve error por consola en caso de encontrarlo
        console.log("existe un problema de conexion con la API");

    }

}
getProducts()

async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem("productsApi")) || await getProducts(),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {},
    };


    console.log(db)      
    insertProductToCart(db)
    filterProducts(db);
    deleteCart(db)
    
    


}
main();


function idProduct(db) {
    const productHTML = document.querySelectorAll('.product')
    const modalHTML = document.querySelector('.product_img_modal')
    const bodyHTML = document.querySelector('.body')



    productHTML.forEach((element) => {

        element.addEventListener('click', (e) => {

            modalHTML.classList.remove('modal_hidden')
            bodyHTML.classList.add('block_body')

            const id = Number(e.currentTarget.id)
            const productFind = db.products.filter((element) => element.id === id)
            const productByCategory = productFind[0].category

            const productSimilar = db.products.filter((element) => element.category === productByCategory)
            console.log(productSimilar);

            let html = "";

            html += `
                <div class="Modal_matriz">

                    <div class="modal_container_title">
                        <i class='bx bx-left-arrow-alt modal_left_exit'></i>
                        <h5 class="modal_title">Academnlo - Tienda oficial</h5>
                    </div>

                    <div class="modal_container_img">
                        <img class="modal_img_product" src="${productFind[0].image}" alt="imagen">
                        <div class="modal_img_bg"></div>
                        <div class="modal_selection_img">
                            <i class='bx bxs-circle black'></i>
                            <i class='bx bxs-circle red' ></i>
                        </div>
                    </div>

                    <div class="modal_product_description">
                        <h2 class="modal_name_product">${productFind[0].name}</h2>                        
                        <h4 class="modal_price_product short"> $${productFind[0].price}.00</h4>
                        <h4 class="modal_category_product short" >${productFind[0].category} oficiales de Academlo </h4>
                        <div class="modal_colores">Colores</div>
                    </div>


                    <div class="modal_container_sizes">
                        <div class="modal_sizes">
                            <h5 class="modal_title_sizes">Tallas</h5>
                            <div class="guia_sizes">
                                <i class='bx bx-question-mark modal_question'></i>
                                <p class="modal_text_guia">Guia de tallas</p>
                            </div>
                        </div>
                        
                        <div class="modal_sizes_opcion">
                            <div class="sizes">S</div>
                            <div class="sizes">M</div>
                            <div class="sizes">L</div>
                            <div class="sizes">XL</div>
                            <div class="sizes">2XL</div>
                            <div class="sizes">3XL</div>
                        </div>   
                        <h3>Productos relacionados</h3>
                        <div class="swiper">                            
                            <div class="swiper-wrapper">
                                <!--imagenes relacionadas-->
                            </div>
                            <div class="swiper-button-prev"></div>  
                            <div class="swiper-button-next"></div>
                        </div>

                        <div class="modal_container_info_cart">
                            <div class="modal_info_cart">
                                <h5 class="modal_title_info_cart">Mantente en contacto</h5>
                                <h5 class="modal_text_alert">!Suscribete para recibir noticias de productos y descuentos especiales</h5>
                                <div class="modal_container_input_button">
                                    <input class="modal_input" type="text" placeholder="Ingresa tu email">
                                    <button class="modal_button">Suscribete</button>
                                </div>
                            </div>
                                
                            <button class="modal_info_button" type="submit">Añadir al carrito</button>
                        </div>
                        
                </div>             
            `
            modalHTML.innerHTML = html
            exitModal();
            productSimilarModal(productSimilar, id);
            addProductToCart(db, id)




            const swiper = new Swiper('.swiper', {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                slidesPerView: 1,
                breakpoints: {
                    400:{
                        slidesPerView: 2,
                    },
                    800: {
                        slidesPerView: 4,
                    },

                },
                on: {
                    init(){

                    }
                }
            })


        })


    })

}

function productSimilarModal(productSimilar, id) {
    const productSimilarHTML = document.querySelector('.swiper-wrapper');

    //productos similares
    let similarHTML = ""

    for (element of productSimilar) {
        if (element.id !== id) {
            similarHTML += `
            <div class='swiper-slide'>
            
                <div class="img_similar">
                    <img class="img_product_similar" src="${element.image}" alt="imagen">                       
                    <div class="description_product">
                        <h2 class="title">${element.name}</h2>
                        <i class='bx bxs-circle black'></i>
                        <i class='bx bxs-circle red' ></i>
                        <h4 class="price"> $${element.price}.00</h4>


                        
                        </div>
                </div>
            
            </div>
            `
        }

    }
    productSimilarHTML.innerHTML = similarHTML


}
//<button class="cart_button">0</button>

function exitModal() {
    const leftButtonHTML = document.querySelector('.modal_left_exit')
    const modalHTML = document.querySelector('.product_img_modal')
    const bodyHTML = document.querySelector('.body')



    leftButtonHTML.addEventListener(('click'), () => {
        modalHTML.classList.add('modal_hidden')
        bodyHTML.classList.remove('block_body')

    })

}

function addProductToCart(db, id) {

    const buttonAddToCartHTML = document.querySelector('.modal_info_button')



    window.localStorage.setItem("products", JSON.stringify(db.products));
    window.localStorage.setItem("cart", JSON.stringify(db.cart));

    const productFind = db.products.filter((element) => element.id === id)

    const product = productFind[0]
    console.log(product)


    buttonAddToCartHTML.addEventListener('click', () => {
        const productId = product.id;

        if (!db.cart[productId]) {
            db.cart[productId] = { ...product, amount: 1 };
        } else {
            if (product.quantity > db.cart[productId].amount) {
                db.cart[productId].amount++;
            } else {
                console.log("No disponemos de más productos");
            }
        }

        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        showAmountProduct(db)
        insertProductToCart(db)
    });

}

function showAmountProduct(db) {
    const amountHTML = document.querySelector('.cart_amount');

    let totalAmount = 0;

    for (const product in db.cart) {

        if (db.cart.hasOwnProperty(product)) {

            totalAmount += db.cart[product].amount;
        }
    }

    amountHTML.innerHTML = totalAmount;
}


function show_cart(db) {
    const cartButtonHTML = document.querySelector('.cartButton')
    const productCartHTML = document.querySelector('.productCart')

    cartButtonHTML.addEventListener(("click"), () => {
        //a la clase productCart le voy a agregar la clase showProductCart
        productCartHTML.classList.toggle("showProductCart")
        
    })

}
show_cart()


function show_cart_add() {

    const productCartHTML = document.querySelector('.productCart')
    const cartAmountHTML = document.querySelector('.cart_amount')

    cartAmountHTML.addEventListener(("click"), () => {
        //a la clase productCart le voy a agregar la clase showProductCart
        productCartHTML.classList.toggle("showProductCart")
        console.log('hola');
    })
}
show_cart_add()


function insertProductToCart(db) {

    containerProductsHTML = document.querySelector('.card_header_cart_product')
    let html = '';

    console.log(db.cart)

    for (productId in db.cart) {
        const product = db.cart[productId];
        html += `
        <div class="product_to_buy">
        <img class="img_product_cart" src="${product.image}" alt="">
        <div class="product_description">
            <div class="product_title">
                <p class="product_name">${product.name}</p>
                <p class="product_price_to_buy">Precio: $ ${product.price}</p>
            </div>

            <div class="product_handdle_to_buy">
                <div class="minus"><i class='bx bx-minus' ></i></div>
                <p class="quantity">${product.amount}</p>
                <div class="plus"><i class='bx bx-plus' ></i></div>
                <i class='bx bxs-trash trash'></i>
            </div>
        </div>
        </div>
        `
    }

    containerProductsHTML.innerHTML = html
    showAmountProduct(db);

}

function filterProducts(db) {
    const selectElement = document.getElementById("mySelect");

    const productsHTML = document.querySelector(".container_product");

    //html hay te va..
    let html = "";
    for (element of db.products) {
        html += `
    <div class="product" id="${element.id}">
        <img class="img_product" src="${element.image}" alt="imagen">
            <div class="description_product">
                <h2 class="title">${element.name}</h2>
                <i class='bx bxs-circle black'></i>
                <i class='bx bxs-circle red' ></i>
                <h4 class="price"> $${element.price}.00</h4>
            </div>
    </div>

`
    }
    productsHTML.innerHTML = html;

    selectElement.addEventListener("change", function () {
        const selectedValue = selectElement.value;

        if (selectedValue === 'todos') {
            const productsHTML = document.querySelector(".container_product");

            //html hay te va..
            let html = "";
            for (element of db.products) {
                html += `
    <div class="product" id="${element.id}">
        <img class="img_product" src="${element.image}" alt="imagen">
            <div class="description_product">
                <h2 class="title">${element.name}</h2>
                <i class='bx bxs-circle black'></i>
                <i class='bx bxs-circle red' ></i>
                <h4 class="price"> $${element.price}.00</h4>
            </div>
    </div>

`
            }
            productsHTML.innerHTML = html;
            

        }

        //-----------------hoddies
        if (selectedValue === 'hoddie') {
            const productsHTML = document.querySelector(".container_product");

            const hoddieFilter = db.products.filter((element) => element.category == "hoddie")
            console.log(hoddieFilter);
            //html hay te va..
            let html = "";
            for (element of hoddieFilter) {
                html += `
            <div class="product" id="${element.id}">
                <img class="img_product" src="${element.image}" alt="imagen">
                    <div class="description_product">
                        <h2 class="title">${element.name}</h2>
                        <i class='bx bxs-circle black'></i>
                        <i class='bx bxs-circle red' ></i>
                        <h4 class="price"> $${element.price}.00</h4>
                    </div>
            </div>

        `
            }
            productsHTML.innerHTML = html;
            idProduct(db)
        }

        //-----------------Shirt

        if (selectedValue === 'shirt') {
            const productsHTML = document.querySelector(".container_product");

            const hoddieFilter = db.products.filter((element) => element.category == "shirt")
            console.log(hoddieFilter);
            //html hay te va..
            let html = "";
            for (element of hoddieFilter) {
                html += `
            <div class="product" id="${element.id}">
                <img class="img_product" src="${element.image}" alt="imagen">
                    <div class="description_product">
                        <h2 class="title">${element.name}</h2>
                        <i class='bx bxs-circle black'></i>
                        <i class='bx bxs-circle red' ></i>
                        <h4 class="price"> $${element.price}.00</h4>
                    </div>
            </div>

        `
            }
            productsHTML.innerHTML = html;
            idProduct(db)
        }

        //-----------------sweater

        if (selectedValue === "sweater") {
            const productsHTML = document.querySelector(".container_product");

            const hoddieFilter = db.products.filter((element) => element.category == "sweater")
            console.log(hoddieFilter);
            //html hay te va..
            let html = "";
            for (element of hoddieFilter) {
                html += `
            <div class="product" id="${element.id}">
                <img class="img_product" src="${element.image}" alt="imagen">
                    <div class="description_product">
                        <h2 class="title">${element.name}</h2>
                        <i class='bx bxs-circle black'></i>
                        <i class='bx bxs-circle red' ></i>
                        <h4 class="price"> $${element.price}.00</h4>
                    </div>
            </div>

        `
            }
            productsHTML.innerHTML = html;
            idProduct(db)
        }

        

    });
    idProduct(db)
}

function deleteCart(db){
    const btnBuy = document.querySelector('.btn_buy')

    btnBuy.addEventListener('click', () => { 

        db.cart = {};
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        insertProductToCart(db);
        
        alert('Gracias por su compra')

    });
    
}
