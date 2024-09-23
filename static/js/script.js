const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const cartObs = document.getElementById("obs");
const nameInput = document.getElementById("name");
const nameWarn = document.getElementById("name-warn");
const bairroInput = document.getElementById("bairro");
const bairroWarn = document.getElementById("bairro-warn");
const ruaInput = document.getElementById("rua");
const ruaWarn = document.getElementById("rua-warn");
const hnumberInput = document.getElementById("housenumber");
const hnumberWarn = document.getElementById("hnumber-warn");
const complementoInput = document.getElementById("complemento");
const foneInput = document.getElementById("fone");
const foneWarn = document.getElementById("fone-warn");
const ocultItem = document.getElementById("ocultar");
const aberto = document.getElementById("date-span");

let cart = [];

// Função para carregar a visibilidade dos itens do menu
function updateMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    const visibility = JSON.parse(localStorage.getItem('itemVisibility')) || {};

    menuItems.forEach(item => {
        const itemId = item.getAttribute('data-id');
        if (visibility[itemId] === false) {
            item.style.display = 'none';
        } else {
            item.style.display = '';
        }
    });
}

// Atualiza o menu quando a página carrega
window.addEventListener('DOMContentLoaded', updateMenu);


function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartModal();
    }
}

window.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);


// Abre o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fecha o modal do carrinho clicando fora do conteúdo
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Fecha o modal clicando no botão "X"
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

// Adiciona itens ao carrinho clicando no botão dentro do menu
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }

    if (parentButton) {
        Toastify({
            text: "Item adicionado ao carrinho",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true,
            style: {
                background: "#22c55e",
            },
            onClick: function () { }
        }).showToast();
        return;
    }
});

// Adiciona um item ao carrinho ou aumenta a quantidade de um item existente
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="items-center">
                <div>
                    <p class="font-medium">${item.name} - R$${item.price.toFixed(2)}</p>
                </div>
                
                <div class="counter flex justify-between items-center">
                    <button id="counter-btn" class="remove-from-cart-btn font-bold" data-name="${item.name}">
                        -
                    </button>
                    <p class="flex">${item.quantity}</p>
                    <button id="counter-btn" class="add-to-cart-btn font-bold" data-name="${item.name}">
                        +
                    </button>
                </div>
            </div>
        `;
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover ou adicionar item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }

    if (event.target.classList.contains("add-to-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        addToCart(name);
    }
});

// Função para remover item do carrinho
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

// Funções dos inputs de dados do usuário
nameInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        nameInput.classList.remove("border-red-500");
        nameWarn.classList.add("hidden");
        document.getElementById("name").focus();
    }
});

foneInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== "") {
        foneInput.classList.remove("border-red-500")
        foneWarn.classList.add("hidden");
    }
})

bairroInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        bairroWarn.classList.add("hidden");
    }
});

ruaInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        ruaWarn.classList.add("hidden");
    }
});

hnumberInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        hnumberWarn.classList.add("hidden");
    }
});

// Função formas de pagamento
const radios = document.querySelectorAll('input[name="pay"]');

radios.forEach((radio) => {
    radio.addEventListener('change', function () {
        addInput(this.value);
    });
});

// Função para adicionar input com base na opção selecionada
function addInput(valor) {
    const inputContainer = document.getElementById('InputTroco');
    inputContainer.innerHTML = '';

    if (valor === 'Dinheiro') {
        inputContainer.innerHTML = `
            <label for="inputTroco">Troco Para:</label><br>
            <input class="border-2 p-1 rounded my-1" type="number" min="0" id="valor-troco">
        `;
    }
}

// Funções do botão finalizar pedido
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkopen();
    if (!isOpen) {
        Toastify({
            text: "Estabelecimento fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function () { }
        }).showToast();
        return;
    }

    if (cart.length === 0) {
        Toastify({
            text: "Seu carrinho está vazio!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function () { }
        }).showToast();
        return;
    }

    if (nameInput.value === "") {
        nameWarn.classList.remove("hidden");
        nameInput.classList.add("border-red-500");
        return;
    }

    if(foneInput.value === "") {
        foneWarn.classList.remove("hidden");
        foneInput.classList.add("border-Red-500")
        return;
    }

    if (ruaInput.value === "") {
        ruaWarn.classList.remove("hidden");
        return;
    }

    if (bairroInput.value === "") {
        bairroWarn.classList.remove("hidden");
        return;
    }

    if (hnumberInput.value === "") {
        hnumberWarn.classList.remove("hidden");
        return;
    }

    

    let payformOption = document.querySelector('input[name="pay"]:checked');
    if (!payformOption) {
        Toastify({
            text: "Selecione a forma de pagamento",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function () { }
        }).showToast();
        return;
    }

    let deliveryOption = document.querySelector('input[name="delivery"]:checked');
    if (!deliveryOption) {
        Toastify({
            text: "Selecione a forma de entrega",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function () { }
        }).showToast();
        return;
    }

    function checkopen() {
        const data = new Date();
        const hora = data.getHours();
        return hora >= 0 && hora < 24;
        //estabelecimento aberto
    }

    let taxaEntrega = deliveryOption && deliveryOption.value === "Delivery" ? 5 : 0;
    let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0) + taxaEntrega;

    // Enviar para o WhatsApp
    const cartItems = cart.map((item) => {
        const totItem = (item.quantity * item.price).toFixed(2);
        return (
            `*${item.name} - QTD: ${item.quantity} - Preço: R$${totItem}*\n`
        )
    }).join("\n")
    const payform = document.querySelector('input[name="pay"]:checked').value;
    const data = new Date();
    const hora = data.getHours();
    const minute = String(data.getMinutes()).padStart(2, '0');
    const retirada = document.querySelector('input[name="delivery"]:checked').value;
    const inputTroco = document.getElementById('valor-troco');
    const trocoValor = inputTroco && inputTroco.value ? parseFloat(inputTroco.value) : 0;
    const trocoTexto = trocoValor > 0 ? `*Troco para:* R$ ${trocoValor.toFixed(2)}` :"";
    const separator = "-".repeat(50);
    const message = `*Resumo do Pedido:*\n*Horário:* ${hora}:${minute}\n*Estimativa:* 60 - 80 minutos\n\n${cartItems}\n\n*Observação:* ${cartObs.value}\n*${separator}*\n*Tipo de entrega:* ${retirada}\n*Nome:* ${nameInput.value}\n*Rua:* ${ruaInput.value} - ${hnumberInput.value}\n*Bairro:* ${bairroInput.value}\n*Complemento:* ${complementoInput.value}\n*${separator}*\n*Pagamento:* ${payform}\n${trocoTexto}\n*TOTAL:* *R$${total.toFixed(2)}*\n*${separator}*\n*Continue Pedindo:*\nhttps://cardapiodigital-hazel.vercel.app/`
    const phone = "5588997349933"

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank")

    cart = [];
    updateCartModal()

})

//verificar hora e manipular horario 
function checkopen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 1 && hora < 24;
    //estabelecimento aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkopen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

window.addEventListener('DOMContentLoaded', function() {
    const hiddenItems = JSON.parse(localStorage.getItem('hiddenItems')) || [];

    hiddenItems.forEach(itemClass => {
        const menuItem = document.querySelector(`.${itemClass}`);
        if (menuItem) {
            menuItem.classList.add('hidden');
        }
    });
});



