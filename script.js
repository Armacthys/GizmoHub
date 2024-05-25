// Function to handle adding items to the cart
function addToCart(productName, productPrice, productQuantity) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += productQuantity;
    } else {
        cartItems.push({ name: productName, price: productPrice, quantity: productQuantity });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert(`${productQuantity} ${productName}(s) added to the cart!`);
}

// Function to display cart items
function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    let totalAmount = 0;

    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Price: ₱${item.price.toFixed(2)}</p>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-product="${item.name}">
            <button class="remove-from-cart" data-product="${item.name}">Remove</button>
            <p>Total: ₱${itemTotal.toFixed(2)}</p>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalAmount.textContent = totalAmount.toFixed(2);
}

// Function to update item quantity
function updateItemQuantity(productName, newQuantity) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems.find(item => item.name === productName);

    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems();
    }
}

// Function to remove item from cart
function removeFromCart(productName) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.name !== productName);

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
}

// Function to open modal
function openModal(modal) {
    modal.style.display = "block";
}

// Function to close modal
function closeModal(modal) {
    modal.style.display = "none";
}

// Function to display receipt
function displayReceipt(details) {
    const receiptDetails = document.getElementById('receipt-details');
    receiptDetails.innerHTML = `
        <p>Name: ${details.name}</p>
        <p>Address: ${details.address}</p>
        <p>Contact No: ${details.contact}</p>
        <p>Email: ${details.email}</p>
        <p>Total Amount: ₱${details.total.toFixed(2)}</p>
        <p>Cash Given: ₱${details.cash.toFixed(2)}</p>
        <p>Change: ₱${(details.cash - details.total).toFixed(2)}</p>
    `;

    const receiptModal = document.getElementById('receipt-modal');
    openModal(receiptModal);
}

// Event listener for adding items to the cart
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('p').textContent.replace('₱', '').replace(/,/g, ''));
        const productQuantity = parseInt(productCard.querySelector('.quantity-input').value, 10);
        addToCart(productName, productPrice, productQuantity);
    }

    // Event listener for updating item quantity
    if (e.target.classList.contains('quantity-input')) {
        const productName = e.target.dataset.product;
        const newQuantity = parseInt(e.target.value, 10);
        updateItemQuantity(productName, newQuantity);
    }

    // Event listener for removing items from the cart
    if (e.target.classList.contains('remove-from-cart')) {
        const productName = e.target.dataset.product;
        removeFromCart(productName);
    }
});

// Event listener for checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
    const checkoutModal = document.getElementById('checkout-modal');
    openModal(checkoutModal);
});

// Event listener for closing modals
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        closeModal(modal);
    });
});

// Event listener for checkout form submission
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value;
    const email = document.getElementById('email').value;
    const cash = parseFloat(document.getElementById('cash').value);
    const total = parseFloat(document.getElementById('cart-total-amount').textContent.replace(/,/g, ''));

    if (cash < total) {
        alert("Cash given is less than the total amount. Please provide sufficient cash.");
        return;
    }

    const receiptDetails = {
        name,
        address,
        contact,
        email,
        cash,
        total
    };

    closeModal(document.getElementById('checkout-modal'));
    displayReceipt(receiptDetails);
});

// Event listener for closing receipt modal
document.getElementById('close-receipt-btn').addEventListener('click', () => {
    const receiptModal = document.getElementById('receipt-modal');
    closeModal(receiptModal);
});

// Display cart items on cart.html load
if (document.querySelector('.cart-items')) {
    displayCartItems();
}
