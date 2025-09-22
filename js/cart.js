// Menu items database (same as menu.js)
const menuItems = {
    1: { name: "Classic Espresso", price: 2.50, image: "../images/shop1.png", category: "coffee" },
    2: { name: "Cappuccino", price: 4.25, image: "../images/shop2.jpg", category: "coffee" },
    3: { name: "Caffe Latte", price: 4.50, image: "../images/shop3.jpg", category: "coffee" },
    4: { name: "Americano", price: 3.75, image: "../images/shop4.jpg", category: "coffee" },
    5: { name: "Club Sandwich", price: 6.50, image: "../images/shop1.png", category: "food" },
    6: { name: "College Burger", price: 8.75, image: "../images/shop2.jpg", category: "food" },
    7: { name: "Personal Pizza", price: 7.25, image: "../images/shop3.jpg", category: "food" },
    8: { name: "Fresh Garden Salad", price: 5.50, image: "../images/shop4.jpg", category: "food" },
    9: { name: "Pasta Alfredo", price: 9.25, image: "../images/shop1.png", category: "food" },
    10: { name: "Chicken Wrap", price: 7.75, image: "../images/shop2.jpg", category: "food" },
    11: { name: "Cafe Mocha", price: 4.75, image: "../images/shop3.jpg", category: "coffee" },
    12: { name: "Iced Coffee", price: 3.25, image: "../images/shop4.jpg", category: "coffee" }
};

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartContent = document.getElementById('cart-content');
    const emptyCart = document.getElementById('empty-cart');
    
    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartContent.style.display = 'grid';
    emptyCart.style.display = 'none';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    updateOrderSummary();
}

function updateCartItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const deliveryFee = orderType === 'delivery' ? 2.50 : 0;
    const tax = (subtotal + deliveryFee) * 0.085;
    const total = subtotal + deliveryFee + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

function placeOrder() {
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerEmail = document.getElementById('customer-email').value;
    const specialInstructions = document.getElementById('special-instructions').value;
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    
    // Basic validation
    if (!customerName || !customerPhone || !customerEmail) {
        alert('Please fill in all required customer information.');
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items before placing an order.');
        return;
    }
    
    // Generate order number
    const orderNumber = Math.floor(Math.random() * 10000) + 1000;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = orderType === 'delivery' ? 2.50 : 0;
    const tax = (subtotal + deliveryFee) * 0.085;
    const total = subtotal + deliveryFee + tax;
    
    // Create order details
    const orderDetails = {
        orderNumber: orderNumber,
        customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail
        },
        items: [...cart],
        orderType: orderType,
        specialInstructions: specialInstructions,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        total: total,
        timestamp: new Date().toLocaleString()
    };
    
    // Save order to localStorage (in a real app, this would be sent to a server)
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show confirmation modal
    showOrderConfirmation(orderDetails);
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function showOrderConfirmation(orderDetails) {
    const modal = document.getElementById('order-modal');
    const orderDetailsDiv = document.getElementById('order-details');
    
    orderDetailsDiv.innerHTML = `
        <p><strong>Order #${orderDetails.orderNumber}</strong></p>
        <p><strong>Customer:</strong> ${orderDetails.customer.name}</p>
        <p><strong>Phone:</strong> ${orderDetails.customer.phone}</p>
        <p><strong>Order Type:</strong> ${orderDetails.orderType.charAt(0).toUpperCase() + orderDetails.orderType.slice(1)}</p>
        <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
        <p><strong>Estimated Time:</strong> ${orderDetails.orderType === 'pickup' ? '15-20' : '25-30'} minutes</p>
    `;
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCart();
    
    // Mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuIcon && navMenu) {
        menuIcon.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuIcon.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Add event listeners for order type change
    document.querySelectorAll('input[name="orderType"]').forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });
    
    // Add event listeners for buttons
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('order-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
});