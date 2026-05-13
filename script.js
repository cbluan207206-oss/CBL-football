// Khởi tạo giỏ hàng từ LocalStorage nếu có
let cart = JSON.parse(localStorage.getItem('cbl_cart')) || [];

function showSection(index) {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, i) => {
        if(i === index) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    // Đóng các modal nếu đang mở khi chuyển trang
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    saveCart();
    updateCartUI();
    alert("Đã thêm " + name + " vào giỏ!");
}

function saveCart() {
    localStorage.setItem('cbl_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if(countEl) countEl.innerText = cart.length;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        renderCartItems();
    }
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('total-price');
    
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:20px;">Chưa có sản phẩm nào.</p>';
        totalEl.innerText = '0đ';
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach((item, index) => {
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <div style="text-align:left;">
                    <span style="display:block; font-weight:bold;">${item.name}</span>
                    <span style="color:#ff4757;">${item.price}đ</span>
                </div>
                <button onclick="removeFromCart(${index})" 
                        style="background:#ff4757; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">
                    Hủy
                </button>
            </div>
        `;
        total += parseInt(item.price.replace(/\./g, ''));
    });

    list.innerHTML = html;
    totalEl.innerText = total.toLocaleString('vi-VN') + "đ";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI(); 
    renderCartItems(); 
}

function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function confirmOrder() {
    const name = document.getElementById('cus-name').value;
    const phone = document.getElementById('cus-phone').value;
    const address = document.getElementById('cus-address').value;
    const note = document.getElementById('cus-note').value;
    const size = document.getElementById('cus-size').value;

    if (!size || !name || !phone || !address) {
        alert("Vui lòng chọn Size và điền đủ thông tin nhận hàng!");
        return;
    }

    let productNames = cart.map(item => item.name).join(", ");
    let totalPrice = document.getElementById('total-price').innerText;

    const messageContent = `
👟 ĐƠN HÀNG MỚI - CBL SOCCER 👟
----------------------------
📦 Sản phẩm: ${productNames}
📏 Size: ${size}
💰 Tổng cộng: ${totalPrice}
👤 Khách: ${name}
📞 SĐT: ${phone}
📍 Địa chỉ: ${address}
📝 Ghi chú: ${note || 'Không có'}
----------------------------
🚀 Check đơn ngay chủ shop ơi!
    `;
    
    sendTelegramMessage(messageContent);

    const billDetail = document.getElementById('bill-detail');
    if (billDetail) {
        billDetail.innerHTML = `
            <p><b>Sản phẩm:</b> ${productNames}</p>
            <p><b>Size:</b> <span style="color:blue; font-weight:bold;">${size}</span></p>
            <p><b>Tổng tiền:</b> <span style="color:red; font-weight:bold;">${totalPrice}</span></p>
            <hr style="border: 0.5px dashed #ddd; margin: 10px 0;">
            <p><b>Người nhận:</b> ${name}</p>
            <p><b>SĐT:</b> ${phone}</p>
            <p><b>Địa chỉ:</b> ${address}</p>
            <p><b>Ghi chú:</b> ${note || 'Không có'}</p>
        `;
    }

    document.getElementById('checkout-modal').style.display = 'none';
    const billModal = document.getElementById('bill-modal');
    if (billModal) billModal.style.display = 'flex';

    // Xóa giỏ hàng sau khi đặt thành công
    cart = [];
    saveCart();
    updateCartUI();

    setTimeout(() => {
        if (billModal) billModal.style.display = 'none';
        document.getElementById('cus-name').value = "";
        document.getElementById('cus-phone').value = "";
        document.getElementById('cus-address').value = "";
        document.getElementById('cus-note').value = "";
        document.getElementById('cus-size').value = "";
    }, 6000);
}

function showProductDetail(name, price, size, desc, img) {
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <img src="${img}" style="width:100%; border-radius:10px; margin-bottom:15px;">
        <h2>${name}</h2>
        <p style="color:#ff4757; font-weight:bold; font-size:20px;">${price}đ</p>
        <p><b>Size:</b> ${size}</p>
        <p style="color:#666; margin:15px 0;">${desc}</p>
        <button onclick="addToCart('${name}', '${price}'); closeProductDetail()" style="width:100%; padding:12px; background:#27ae60; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">THÊM VÀO GIỎ NGAY</button>
    `;
    modal.style.display = 'flex';
}

function closeProductDetail() {
    document.getElementById('product-detail-modal').style.display = 'none';
}
// --- ĐOẠN CODE TÌM KIẾM MỚI ---
function searchProduct() {
    // Lấy từ khóa người dùng nhập và chuyển về chữ thường
    let input = document.getElementById('product-search').value.toLowerCase();
    
    // Lấy tất cả các thẻ sản phẩm trong grid
    let cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        // Lấy tên sản phẩm bên trong thẻ h3 của từng card
        let productName = card.querySelector('h3').innerText.toLowerCase();
        
        // So khớp: Nếu tên sản phẩm chứa từ khóa thì hiện, không thì ẩn
        if (productName.includes(input)) {
            card.style.display = "flex"; 
        } else {
            card.style.display = "none"; 
        }
    });

    // Nếu người dùng đang gõ, tự động chuyển sang trang Sản Phẩm (Section 1) để xem kết quả
    if (input.length > 0) {
        showSection(1);
    }
}
// ------------------------------

// Hàm Telegram của bạn vẫn giữ nguyên ở dưới này...

function sendTelegramMessage(message) {
    const token = "8711185097:AAGNpNiha-FaDf-mZB9HtiBON1rW0iSz_K0";
    const chatId = "7901882812";
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    fetch(url);
}

// Khi trang load xong
window.onload = () => {
    updateCartUI();
    showSection(0); // Luôn bắt đầu ở trang chủ
};
const container = document.getElementById('auth-container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Chuyển sang giao diện Đăng ký
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

// Chuyển sang giao diện Đăng nhập
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Xử lý khi nhấn nút Đăng nhập
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Tại đây bạn sẽ gọi API để kiểm tra tài khoản
    alert("Đang xử lý đăng nhập...");
});
// Ví dụ logic Backend (Node.js + Express)
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Giả lập lưu trữ User vào Database
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    // 1. Kiểm tra email tồn tại
    const userExists = await db.findUserByEmail(email);
    if (userExists) {
        return res.status(400).json({ message: "Email đã tồn tại trên hệ thống!" });
    }

    // 2. Bảo mật: Băm mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 3. Lưu vào DB
    await db.saveUser({ email, password: hashedPassword });
    res.status(201).json({ message: "Đăng ký thành công!" });
});
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Hiển thị lỗi phản hồi từ Server (Ví dụ: "Sai mật khẩu")
            loginError.innerText = data.message;
            loginError.style.display = 'block';
        } else {
            // Đăng nhập thành công
            window.location.href = "/trang-chu";
        }
    } catch (err) {
        loginError.innerText = "Lỗi kết nối máy chủ!";
        loginError.style.display = 'block';
    }
});
