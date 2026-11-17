// NK Scents - Single Consolidated JavaScript File

// Default Products Data
const defaultProducts = [
    {
        id: 1,
        name: "Urban Edge",
        price: 3500,
        description: "A modern fragrance for the urban man with notes of cedar and citrus.",
        image: "assets/images/home1.png",
        category: "men"
    },
    {
        id: 2,
        name: "Amber Nuit",
        price: 3000,
        description: "A mysterious and warm scent for women featuring amber and deep floral notes.",
        image: "assets/images/home2.png",
        category: "women"
    },
    {
        id: 3,
        name: "Eternal Alpha",
        price: 3200,
        description: "The scent of leadership and power, blending spicy woods and leather.",
        image: "assets/images/home3.png",
        category: "men"
    },
    {
        id: 4,
        name: "Royal Mist",
        price: 2800,
        description: "An enchanting royal fragrance with a light, misty floral base.",
        image: "assets/images/home4.png",
        category: "women"
    },
    {
        id: 5,
        name: "Midnight Noir",
        price: 4000,
        description: "A deep, seductive evening scent for the modern gentleman.",
        image: "assets/images/men1.png",
        category: "men"
    },
    {
        id: 6,
        name: "Silver Oak",
        price: 3200,
        description: "Earthy tones of oakmoss and silver birch for a grounded presence.",
        image: "assets/images/men2.png",
        category: "men"
    },
    {
        id: 7,
        name: "Ocean Breeze",
        price: 2500,
        description: "Refreshingly light and airy, reminiscent of a crisp morning at sea.",
        image: "assets/images/men3.png",
        category: "men"
    },
    {
        id: 8,
        name: "Floral Bloom",
        price: 3500,
        description: "A garden of fresh lilies and jasmines in a single bottle.",
        image: "assets/images/women1.png",
        category: "women"
    },
    {
        id: 9,
        name: "Velvet Rose",
        price: 4200,
        description: "The ultimate luxury of Bulgarian roses and smooth velvet undertones.",
        image: "assets/images/women2.png",
        category: "women"
    },
    {
        id: 10,
        name: "Sweet Vanilla",
        price: 2900,
        description: "A comforting and delicious scent of pure Madagascar vanilla.",
        image: "assets/images/women3.png",
        category: "women"
    }
];

// ==========================================
// DATA ACCESS HELPERS
// ==========================================

function getProducts() {
    const stored = localStorage.getItem('nk_products');
    if (!stored) {
        localStorage.setItem('nk_products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        return defaultProducts;
    }
}

function getCart() {
    const stored = localStorage.getItem('nk_cart');
    try {
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('nk_cart', JSON.stringify(cart));
}

function getCurrentUser() {
    const user = localStorage.getItem('nk_user');
    try {
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
}

function isInCart(productId) {
    const cart = getCart();
    return cart.some(item => Number(item.id) === Number(productId));
}

// ==========================================
// USER CART & SHOPPING FUNCTIONS
// ==========================================

function addToCart(id, name, price, image) {
    const user = getCurrentUser();
    if (!user) {
        localStorage.setItem('nk_pending_item', JSON.stringify({ id, name, price, image }));
        window.location.href = 'login.html';
        return;
    }

    const cart = getCart();
    if (!cart.some(item => Number(item.id) === Number(id))) {
        cart.push({ id: Number(id), name, price: Number(price), image });
        saveCart(cart);
    }
    window.location.href = 'cart.html';
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => Number(item.id) !== Number(id));
    saveCart(cart);
    renderCartPage();
}

// ==========================================
// USER AUTHENTICATION FUNCTIONS
// ==========================================

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('nk_users')) || [];
    } catch (e) {
        users = [];
    }

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        user = { id: Date.now(), name: email.split('@')[0], email: email };
    }

    localStorage.setItem('nk_user', JSON.stringify(user));

    const pending = localStorage.getItem('nk_pending_item');
    if (pending) {
        try {
            const item = JSON.parse(pending);
            const cart = getCart();
            if (!cart.some(c => Number(c.id) === Number(item.id))) {
                cart.push(item);
                saveCart(cart);
            }
            localStorage.removeItem('nk_pending_item');
            window.location.href = 'cart.html';
            return;
        } catch (e) {}
    }
    window.location.href = 'index.html';
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('nk_users')) || [];
    } catch (e) {
        users = [];
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('nk_users', JSON.stringify(users));

    alert('Registration Successful. Please Login.');
    window.location.href = 'login.html';
}

function logoutUser() {
    localStorage.removeItem('nk_user');
    window.location.href = 'login.html';
}

function updateNavbar() {
    const user = getCurrentUser();
    const userMenu = document.getElementById('user-menu');
    const loginNav = document.getElementById('login-nav');

    if (userMenu && loginNav) {
        if (user) {
            userMenu.style.display = 'block';
            loginNav.style.display = 'none';
        } else {
            userMenu.style.display = 'none';
            loginNav.style.display = 'block';
        }
    }
}

// ==========================================
// USER PAGE RENDERERS
// ==========================================

function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const products = getProducts();
    const user = getCurrentUser();

    if (products.length === 0) {
        container.innerHTML = '<p>No products featured yet.</p>';
        return;
    }

    let html = '';
    const reversed = [...products].reverse();

    reversed.forEach(p => {
        const inCart = isInCart(p.id);
        let buttonHtml = '';
        if (inCart && user) {
            buttonHtml = `<a href="cart.html" class="btn" style="background: #6b5b4d; display: block; text-decoration: none;">View In Cart</a>`;
        } else {
            buttonHtml = `<button onclick="addToCart(${p.id}, '${escapeQuotes(p.name)}', ${p.price}, '${p.image}')" class="btn" style="border:none; cursor:pointer; width:100%; font-family: inherit;">Add to Cart</button>`;
        }

        html += `
        <div class="card">
            <img src="${p.image}" alt="${escapeHtml(p.name)}">
            <h3>${escapeHtml(p.name)}</h3>
            <p style="color: #8b5e3c; font-weight: bold;">₹${Number(p.price).toLocaleString()}</p>
            ${buttonHtml}
            <a href="product_detail.html?id=${p.id}" style="display:block; margin-top:10px; font-size:0.9rem; color:#8b5e3c; text-decoration:none;">View Details</a>
        </div>
        `;
    });

    container.innerHTML = html;
}

function renderProductsPage() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    const bannerTitle = document.getElementById('banner-title');
    const bannerSubtitle = document.getElementById('banner-subtitle');

    if (category) {
        const catName = category.charAt(0).toUpperCase() + category.slice(1);
        if (bannerTitle) bannerTitle.textContent = `${catName} Scents`;
        if (bannerSubtitle) {
            bannerSubtitle.textContent = (category.toLowerCase() === 'women') 
                ? 'Soft. Elegant. Forever in Mind.' 
                : 'Strong. Bold. Timeless.';
        }
    } else {
        if (bannerTitle) bannerTitle.textContent = 'Our Collection';
        if (bannerSubtitle) bannerSubtitle.textContent = 'Strong. Bold. Timeless.';
    }

    let products = getProducts();
    if (category) {
        products = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    const user = getCurrentUser();

    if (products.length === 0) {
        container.innerHTML = "<div style='grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted); font-size: 1.2rem;'>No products found in this category yet.</div>";
        return;
    }

    let html = '';
    const reversed = [...products].reverse();

    reversed.forEach(p => {
        const inCart = isInCart(p.id);
        let buttonHtml = '';
        if (inCart && user) {
            buttonHtml = `<a href="cart.html" class="btn" style="background: #6b5b4d; display: block; text-decoration: none;">View In Cart</a>`;
        } else {
            buttonHtml = `<button onclick="addToCart(${p.id}, '${escapeQuotes(p.name)}', ${p.price}, '${p.image}')" class="btn" style="border:none; cursor:pointer; width:100%; font-family: inherit;">Add to Cart</button>`;
        }

        html += `
        <div class="card">
            <img src="${p.image}" alt="${escapeHtml(p.name)}">
            <div class="product-info">
                <h3>${escapeHtml(p.name)}</h3>
                <p class="price" style="color: #8b5e3c; font-weight: bold; font-size: 1.1rem; margin: 10px 0;">₹${Number(p.price).toLocaleString()}</p>
                ${buttonHtml}
                <a href="product_detail.html?id=${p.id}" style="display:block; margin-top:10px; font-size:0.9rem; color:#8b5e3c; text-decoration:none;">View Details</a>
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

function renderProductDetailPage() {
    const container = document.getElementById('detail-wrapper');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        window.location.href = 'products.html';
        return;
    }

    const products = getProducts();
    const product = products.find(p => Number(p.id) === Number(id));

    if (!product) {
        container.innerHTML = "<div style='text-align: center; padding: 100px; font-size: 1.5rem; color: var(--text-muted);'>Product not found.</div>";
        return;
    }

    const user = getCurrentUser();
    const inCart = isInCart(product.id);

    let actionButton = '';
    if (inCart && user) {
        actionButton = `<a href="cart.html" class="btn-cart" style="text-decoration: none; display: inline-block; text-align: center; background: #6b5b4d;">View In Cart</a>`;
    } else {
        actionButton = `<button onclick="addToCart(${product.id}, '${escapeQuotes(product.name)}', ${product.price}, '${product.image}')" class="btn-cart">Add To Cart</button>`;
    }

    container.innerHTML = `
    <div class="detail-container">
        <div>
            <img src="${product.image}" class="detail-img" alt="${escapeHtml(product.name)}">
        </div>
        
        <div class="detail-info">
            <h2 style="font-family: 'Playfair Display', serif; font-weight: 700;">${escapeHtml(product.name)}</h2>
            
            <p class="price" style="color: #8b5e3c; font-size: 2.5rem; font-weight: 700; margin-bottom: 15px;">
                ₹${Number(product.price).toLocaleString()}
                <span style="font-size: 0.9rem; color: #a07f5b; font-weight: 400; text-transform: uppercase; letter-spacing: 1px;">
                    &nbsp;|&nbsp; ${escapeHtml(product.category)} collection
                </span>
            </p>
            
            <div style="width: 50px; height: 3px; background: var(--gold); margin-bottom: 25px;"></div>
            
            <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 40px; white-space: pre-wrap;">${escapeHtml(product.description)}</p>

            ${actionButton}
        </div>
    </div>
    `;
}

function renderCartPage() {
    const container = document.getElementById('cart-page-content');
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <i class='bx bx-shopping-bag' style='font-size: 4rem; color: #ddd; margin-bottom: 20px;'></i>
            <p style='color: var(--text-muted); font-size: 1.2rem; margin-bottom: 30px;'>Your cart is currently empty.</p>
            <a class="btn" href="products.html">Discover Fragrances</a>
        </div>
        `;
        return;
    }

    let total = 0;
    let rowsHtml = '';

    cart.forEach(item => {
        total += Number(item.price);
        rowsHtml += `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 20px;">
                    <img src="${item.image || 'assets/images/default.jpg'}" class="cart-item-img" alt="Product">
                    <span style="font-weight: 500; font-size: 1.1rem;">${escapeHtml(item.name)}</span>
                </div>
            </td>
            <td><span style="font-weight: 600; color: #3b2f2f;">₹${Number(item.price).toLocaleString()}</span></td>
            <td style="text-align: right;">
                <a href="javascript:void(0)" onclick="removeFromCart(${item.id})" style="color: #e57373; text-decoration: none; font-weight: 500;">Remove</a>
            </td>
        </tr>
        `;
    });

    container.innerHTML = `
    <table class="cart-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th style="text-align: right;">Action</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>

    <div class="total-section">
        <p style="font-size: 1.5rem; color: #3b2f2f;">Subtotal: <strong>₹${total.toLocaleString()}</strong></p>
        <div style="margin-top: 20px;">
            <a class="btn-cart" href="checkout.html" style="text-decoration: none; display: inline-block;">Proceed to Secure Checkout</a>
        </div>
    </div>
    `;
}

function processCheckout() {
    const container = document.getElementById('checkout-result');
    if (!container) return;

    const cart = getCart();
    const user = getCurrentUser();

    if (cart.length > 0) {
        let orders = [];
        try {
            orders = JSON.parse(localStorage.getItem('nk_orders')) || [];
        } catch (e) {
            orders = [];
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        cart.forEach(item => {
            orders.push({
                id: Math.floor(1000 + Math.random() * 9000),
                userId: user ? user.id : null,
                product_name: item.name,
                price: item.price,
                order_date: dateStr,
                status: 'Pending'
            });
        });

        localStorage.setItem('nk_orders', JSON.stringify(orders));
        localStorage.removeItem('nk_cart');

        container.innerHTML = `
        <i class='bx bxs-check-circle success-icon'></i>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #3b2f2f; margin-bottom: 15px;">Order Placed!</h2>
        <p style="color: #a07f5b; font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
            Thank you for choosing NK Scents. Your luxury fragrance journey has begun. We'll process your order immediately.
        </p>
        <a href="products.html" class="btn-cart" style="text-decoration: none; display: inline-block;">Continue Exploring</a>
        `;
    } else {
        container.innerHTML = `
        <i class='bx bx-error-circle success-icon' style="color: #e57373;"></i>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #3b2f2f; margin-bottom: 15px;">No Items Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 30px;">It seems your cart was empty. Let's find something perfect for you.</p>
        <a href="products.html" class="btn" style="text-decoration: none;">Go to Shop</a>
        `;
    }
}

function renderMyOrdersPage() {
    const container = document.getElementById('orders-wrapper');
    if (!container) return;

    const user = getCurrentUser();
    if (!user) {
        container.innerHTML = `
        <div class='success-container'>
            <i class='bx bx-lock-alt success-icon' style='color: #e57373;'></i>
            <h2 style='font-family: "Playfair Display", serif;'>Please Login</h2>
            <p>You need to be logged in to view your orders.</p>
            <a href='login.html' class='btn-cart' style='text-decoration: none;'>Login Now</a>
        </div>
        `;
        return;
    }

    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('nk_orders')) || [];
    } catch (e) {
        orders = [];
    }

    const userOrders = orders.filter(o => !o.userId || o.userId === user.id);

    if (userOrders.length === 0) {
        container.innerHTML = `
        <div class="cart-container" style="max-width: 1000px;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 30px; text-align: center;">My Orders</h2>
            <div style="text-align: center; padding: 40px;">
                <i class='bx bx-package' style='font-size: 4rem; color: #ddd; margin-bottom: 20px;'></i>
                <p style='color: var(--text-muted); font-size: 1.2rem; margin-bottom: 30px;'>You haven't placed any orders yet.</p>
                <a class="btn" href="products.html">Start Shopping</a>
            </div>
        </div>
        `;
        return;
    }

    let rowsHtml = '';
    [...userOrders].reverse().forEach(o => {
        const orderIdFormatted = '#' + String(o.id).padStart(4, '0');
        const cancelBtn = (o.status === 'Pending')
            ? `<a href="javascript:void(0)" onclick="cancelOrder(${o.id})" style="color: #e57373; text-decoration: none; font-weight: 500;">Cancel</a>`
            : `<span style="color: #ccc;">N/A</span>`;

        rowsHtml += `
        <tr>
            <td>${orderIdFormatted}</td>
            <td>${escapeHtml(o.product_name)}</td>
            <td>₹${Number(o.price).toLocaleString()}</td>
            <td>${escapeHtml(o.order_date)}</td>
            <td>
                <span style="background: #f3e9dd; color: #8b5e3c; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                    ${escapeHtml(o.status)}
                </span>
            </td>
            <td>${cancelBtn}</td>
        </tr>
        `;
    });

    container.innerHTML = `
    <div class="cart-container" style="max-width: 1000px;">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 30px; text-align: center;">My Orders</h2>
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>
    </div>
    `;
}

function cancelOrder(id) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('nk_orders')) || [];
    } catch (e) {
        orders = [];
    }

    orders = orders.map(o => {
        if (Number(o.id) === Number(id)) {
            o.status = 'Cancelled';
        }
        return o;
    });

    localStorage.setItem('nk_orders', JSON.stringify(orders));
    renderMyOrdersPage();
}

// ==========================================
// ADMIN PANEL FUNCTIONS
// ==========================================

function checkAdminAuth() {
    const isLoginPage = window.location.pathname.endsWith('admin_login.html');
    const isAdmin = sessionStorage.getItem('nk_admin');
    
    // Only enforce check if currently on an admin page
    const isAdminPage = window.location.pathname.includes('admin_');
    if (isAdminPage && !isLoginPage && !isAdmin) {
        window.location.href = 'admin_login.html';
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value.trim();
    const errEl = document.getElementById('adminError');

    if (u === 'admin' && p === 'admin123') {
        sessionStorage.setItem('nk_admin', 'true');
        window.location.href = 'admin_dashboard.html';
    } else {
        if (errEl) {
            errEl.textContent = 'Invalid username or password';
            errEl.style.display = 'block';
        } else {
            alert('Invalid username or password');
        }
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem('nk_admin');
    window.location.href = 'admin_login.html';
}

function renderAdminDashboard() {
    const prodCountEl = document.getElementById('dash-prod-count');
    const orderCountEl = document.getElementById('dash-order-count');

    if (prodCountEl || orderCountEl) {
        let products = getProducts();
        let orders = [];
        try {
            orders = JSON.parse(localStorage.getItem('nk_orders')) || [];
        } catch (e) {}

        if (prodCountEl) prodCountEl.textContent = products.length;
        if (orderCountEl) orderCountEl.textContent = orders.length;
    }
}

function renderAdminProducts() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    let products = getProducts();

    if (products.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align: center; color: var(--text-muted); padding: 30px;'>No products found. Start by adding one!</td></tr>";
        return;
    }

    let html = '';
    [...products].reverse().forEach(p => {
        html += `
        <tr>
            <td><img src="${p.image || 'assets/images/default.jpg'}" alt="Photo" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border);"></td>
            <td style="font-weight: 500;">${escapeHtml(p.name)}</td>
            <td style="text-transform: capitalize;">${escapeHtml(p.category || 'unisex')}</td>
            <td style="font-weight: 600; color: var(--success);">₹${Number(p.price).toLocaleString()}</td>
            <td style="text-align: right;">
                <a href="admin_edit_product.html?id=${p.id}" class="btn btn-warning" style="margin-right: 8px;">
                    <i class='bx bx-edit'></i> Edit
                </a>
                <a href="javascript:void(0)" onclick="deleteAdminProduct(${p.id})" class="btn btn-danger">
                    <i class='bx bx-trash'></i> Delete
                </a>
            </td>
        </tr>
        `;
    });
    tbody.innerHTML = html;
}

function deleteAdminProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    let products = getProducts();
    products = products.filter(p => Number(p.id) !== Number(id));
    localStorage.setItem('nk_products', JSON.stringify(products));
    renderAdminProducts();
}

function handleAddProduct(event) {
    event.preventDefault();
    const name = document.getElementById('prodName').value.trim();
    const price = parseFloat(document.getElementById('prodPrice').value);
    const category = document.getElementById('prodCategory').value;
    const desc = document.getElementById('prodDesc').value.trim();
    const imgInput = document.getElementById('prodImage');

    let image = 'assets/images/home1.png';
    if (imgInput && imgInput.files && imgInput.files[0]) {
        image = 'assets/images/' + imgInput.files[0].name;
    }

    let products = getProducts();
    const newProd = {
        id: Date.now(),
        name,
        price,
        category,
        description: desc,
        image
    };

    products.push(newProd);
    localStorage.setItem('nk_products', JSON.stringify(products));
    alert('Product added successfully!');
    window.location.href = 'admin_manage_products.html';
}

function renderEditProductPage() {
    const form = document.getElementById('editProductForm');
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        window.location.href = 'admin_manage_products.html';
        return;
    }

    let products = getProducts();
    const product = products.find(p => Number(p.id) === Number(id));
    if (!product) {
        alert('Product not found.');
        window.location.href = 'admin_manage_products.html';
        return;
    }

    document.getElementById('editProdId').value = product.id;
    document.getElementById('editProdName').value = product.name;
    document.getElementById('editProdPrice').value = product.price;
    document.getElementById('editProdCategory').value = product.category || 'men';
    document.getElementById('editProdDesc').value = product.description;
    if (document.getElementById('editCurrentImg')) {
        document.getElementById('editCurrentImg').src = product.image || 'assets/images/default.jpg';
    }
}

function handleUpdateProduct(event) {
    event.preventDefault();
    const id = document.getElementById('editProdId').value;
    const name = document.getElementById('editProdName').value.trim();
    const price = parseFloat(document.getElementById('editProdPrice').value);
    const category = document.getElementById('editProdCategory').value;
    const desc = document.getElementById('editProdDesc').value.trim();
    const imgInput = document.getElementById('editProdImage');

    let products = getProducts();
    products = products.map(p => {
        if (Number(p.id) === Number(id)) {
            p.name = name;
            p.price = price;
            p.category = category;
            p.description = desc;
            if (imgInput && imgInput.files && imgInput.files[0]) {
                p.image = 'assets/images/' + imgInput.files[0].name;
            }
        }
        return p;
    });

    localStorage.setItem('nk_products', JSON.stringify(products));
    alert('Product updated successfully!');
    window.location.href = 'admin_manage_products.html';
}

function renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;

    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('nk_orders')) || [];
    } catch (e) {}

    if (orders.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align: center; color: var(--text-muted); padding: 40px;'>No orders found.</td></tr>";
        return;
    }

    let html = '';
    [...orders].reverse().forEach(o => {
        const orderIdFormatted = '#' + String(o.id).padStart(4, '0');
        html += `
        <tr>
            <td style="font-weight: 600; color: var(--text-muted);">${orderIdFormatted}</td>
            <td style="font-weight: 500; color: var(--text-main);">${escapeHtml(o.product_name)}</td>
            <td style="color: var(--success); font-weight: 500;">₹${Number(o.price).toLocaleString()}</td>
            <td style="color: var(--text-muted); font-size: 0.9rem;">${escapeHtml(o.order_date)}</td>
            <td><span style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 600;"><i class='bx bx-check-circle'></i> ${escapeHtml(o.status)}</span></td>
            <td><a href="javascript:void(0)" onclick="deleteAdminOrder(${o.id})" style="color: #ef4444; font-size: 1.25rem;"><i class='bx bx-trash'></i></a></td>
        </tr>
        `;
    });
    tbody.innerHTML = html;
}

function deleteAdminOrder(id) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('nk_orders')) || [];
    } catch (e) {}

    orders = orders.filter(o => Number(o.id) !== Number(id));
    localStorage.setItem('nk_orders', JSON.stringify(orders));
    renderAdminOrders();
}

// ==========================================
// STRING & HTML ESCAPING UTILITIES
// ==========================================

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeQuotes(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "\\'");
}

// ==========================================
// AUTO-INITIALIZE ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // User functions
    updateNavbar();
    renderFeaturedProducts();
    renderProductsPage();
    renderProductDetailPage();
    renderCartPage();
    processCheckout();
    renderMyOrdersPage();

    // Admin functions
    checkAdminAuth();
    renderAdminDashboard();
    renderAdminProducts();
    renderEditProductPage();
    renderAdminOrders();
});
