let cart = [];
let cartTotal = 0;

// Função para adicionar item ao carrinho
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('✅ Produto adicionado ao carrinho!');
}

// Função para remover item do carrinho
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('🗑️ Produto removido do carrinho!');
}

// Função para atualizar quantidade
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
    }
    updateCart();
}

// Função para atualizar o carrinho
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar lista de itens
    cartItems.innerHTML = '';
    cartTotal = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>🛒 Seu carrinho está vazio</p>
                <small>Adicione alguns produtos incríveis!</small>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span style="margin: 0 10px; font-weight: bold;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Atualizar total
    cartTotalElement.textContent = cartTotal.toFixed(2);
}

// Função para alternar visibilidade do carrinho
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Função para prosseguir para checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('⚠️ Seu carrinho está vazio!');
        return;
    }
    
    toggleCart(); // Fechar carrinho
    openCheckout();
}

// Função para abrir modal de checkout
function openCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    // Atualizar resumo do pedido
    orderItems.innerHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-info">
                <strong>${item.name}</strong>
                <div>${item.quantity}x R$ ${item.price.toFixed(2)}</div>
            </div>
            <strong>R$ ${itemTotal.toFixed(2)}</strong>
        `;
        orderItems.appendChild(orderItem);
    });
    
    orderTotal.textContent = cartTotal.toFixed(2);
    checkoutModal.classList.add('active');
}

// Função para fechar checkout
function closeCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.classList.remove('active');
}

// Função para mostrar notificação
function showNotification(message) {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        color: white;
        padding: 20px 25px;
        border-radius: 15px;
        z-index: 1003;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        font-weight: 600;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Event listener para o formulário de checkout
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simular processamento do pedido
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        cep: document.getElementById('cep').value,
        payment: document.getElementById('payment').value
    };
    
    // Aqui você enviaria os dados para o servidor
    console.log('Dados do pedido:', formData);
    console.log('Itens do carrinho:', cart);
    
    // Simular sucesso no pedido
    showNotification('🎉 Pedido realizado com sucesso! Obrigado pela compra.');
    
    // Limpar carrinho e fechar modais
    cart = [];
    updateCart();
    closeCheckout();
    toggleCart();
    
    // Limpar formulário
    this.reset();
});

// Fechar modais ao clicar fora
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const checkoutModal = document.getElementById('checkout-modal');
    
    if (e.target === cartOverlay) {
        toggleCart();
    }
    
    if (e.target === checkoutModal) {
        closeCheckout();
    }
});

// Inicializar carrinho
updateCart();
