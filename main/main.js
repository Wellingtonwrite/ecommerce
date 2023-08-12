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
    showProducts(db)
    idProduct(db);
}
main();

function showProducts(db) {
    //buscamos la clase del contenedor de los productos
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
                        
                    </div>             
            `
            modalHTML.innerHTML = html
            exitModal();
            productSimilarModal(productSimilar, id);

            const swiper = new Swiper('.swiper', {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
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


function exitModal() {
    const leftButtonHTML = document.querySelector('.modal_left_exit')
    const modalHTML = document.querySelector('.product_img_modal')
    const bodyHTML = document.querySelector('.body')



    leftButtonHTML.addEventListener(('click'), () => {
        modalHTML.classList.add('modal_hidden')
        bodyHTML.classList.remove('block_body')

    })

}



