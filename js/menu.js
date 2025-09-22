// Menu items database
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

function changeQuantity(itemId, change) {
    const qtyElement = document.getElementById(`qty-${itemId}`);
    let currentQty = parseInt(qtyElement.textContent);
    currentQty += change;
    if (currentQty < 1) currentQty = 1;
    qtyElement.textContent = currentQty;
}

function addToCart(itemId) {
    const quantity = parseInt(document.getElementById(`qty-${itemId}`).textContent);
    const item = menuItems[itemId];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: itemId,
            name: item.name,
            price: item.price,
            quantity: quantity,
            image: item.image
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show feedback
    showAddToCartFeedback(item.name, quantity);
    
    // Reset quantity to 1
    document.getElementById(`qty-${itemId}`).textContent = '1';
}

function showAddToCartFeedback(itemName, quantity) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `Added ${quantity} ${itemName}(s) to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Menu filtering functionality
function filterMenu(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter menu items
    menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});