let cart = [];

// 1. Hàm chuyển trang (Giữ nguyên logic lật trang PowerPoint của bạn)
function showSection(index) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    pages[index].classList.add('active');
    
    // Đóng giỏ hàng luôn nếu đang mở khi chuyển trang
    document.getElementById('cart-modal').style.display = 'none';
}

// 2. Hàm Thêm sản phẩm vào mảng giỏ hàng
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    alert("Đã thêm " + name + " vào giỏ!");
}

// 3. Cập nhật số hiển thị trên icon giỏ hàng
function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
}

// 4. Hàm ẩn/hiện bảng chi tiết giỏ hàng
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        renderCartItems();
    }
}

// 5. Hàm liệt kê các món đồ đã mua vào bảng
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
cart.forEach((item, index) => { // Thêm index vào đây
    html += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <div>
                <span style="display:block; font-weight:bold;">${item.name}</span>
                <span style="color:#ff4757;">${item.price}đ</span>
            </div>
            <button onclick="removeFromCart(${index})" 
                    style="background:#ff4757; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; transition: 0.3s;">
                Hủy
            </button>
        </div>
    `;
    total += parseInt(item.price.replace(/\./g, ''));
});

    list.innerHTML = html;
    totalEl.innerText = total.toLocaleString('vi-VN') + "đ";
}

// 6. Hàm Đặt hàng
// Thay thế từ dòng 64
function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }
    // Đóng giỏ hàng và mở bảng điền thông tin
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'block';
}
function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}
function confirmOrder() {
    // 1. Lấy dữ liệu TRƯỚC khi reset
    const name = document.getElementById('cus-name').value;
    const phone = document.getElementById('cus-phone').value;
    const address = document.getElementById('cus-address').value;
    const note = document.getElementById('cus-note').value;
    const size = document.getElementById('cus-size').value;

    // 2. Kiểm tra điền đủ thông tin
    if (!size || !name || !phone || !address) {
        alert("Vui lòng chọn Size và điền đủ thông tin nhận hàng!");
        return;
    }

    // 3. Lấy thông tin giỏ hàng để đưa vào Bill
    // Lưu ý: ID 'total-price' phải khớp với dòng 155 trong index.html của bạn
    let productNames = cart.map(item => item.name).join(", ");
    let totalPrice = document.getElementById('total-price').innerText;
    // --- ĐOẠN MỚI: Gửi thông báo về Telegram ---
    const messageContent = `
👟 ĐƠN HÀNG MỚI - CBL SOCCER 👟
----------------------------
📦 Sản phẩm: ${productNames}
📏 Size: ${size}
💰 Tổng cộng: ${totalPrice}đ
👤 Khách: ${name}
📞 SĐT: ${phone}
📍 Địa chỉ: ${address}
📝 Ghi chú: ${note || 'Không có'}
----------------------------
🚀 Check đơn ngay chủ shop ơi!
    `;
    sendTelegramMessage(messageContent);
    // ------------------------------------------

    // 4. Chèn nội dung vào khu vực bill-detail
    const billDetail = document.getElementById('bill-detail');
    if (billDetail) {
        billDetail.innerHTML = `
            <p><b>Sản phẩm:</b> ${productNames}</p>
            <p><b>Size:</b> <span style="color:blue; font-weight:bold;">${size}</span></p>
            <p><b>Tổng tiền:</b> <span style="color:red; font-weight:bold;">${totalPrice}đ</span></p>
            <hr style="border: 0.5px dashed #ddd;">
            <p><b>Người nhận:</b> ${name}</p>
            <p><b>SĐT:</b> ${phone}</p>
            <p><b>Địa chỉ:</b> ${address}</p>
            <p><b>Ghi chú:</b> ${note || 'Không có'}</p>
        `;
    }

    // 5. Hiện Bill và đóng bảng thông tin khách
    document.getElementById('checkout-modal').style.display = 'none';
    const billModal = document.getElementById('bill-modal');
    if (billModal) {
        billModal.style.display = 'block';
    }

    // 6. Xóa giỏ hàng để bắt đầu đơn mới
    cart = [];
    updateCartUI();

    // 7. Đợi 5 giây rồi mới tự đóng Bill và xóa trắng ô nhập
    setTimeout(() => {
        if (billModal) {
            billModal.style.display = 'none';
        }
        // Xóa trắng dữ liệu ô nhập sau khi bill ẩn
        document.getElementById('cus-name').value = "";
        document.getElementById('cus-phone').value = "";
        document.getElementById('cus-address').value = "";
        document.getElementById('cus-note').value = "";
        document.getElementById('cus-size').value = "";
    }, 5000);
}

window.onload = () => {
    showSection(0);
};
// Hàm hiện thông tin chi tiết
function showProductDetail(name, price, size, desc, img) {
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('detail-content');
    
    content.innerHTML = `
        <img src="${img}" style="width:100%; border-radius:10px; margin-bottom:15px;">
        <h2 style="color:#333;">${name}</h2>
        <p style="color:#ff4757; font-size:20px; font-weight:bold;">Giá: ${price}đ</p>
        <p><b>Size:</b> ${size}</p>
        <p style="color:#666; line-height:1.6; margin:15px 0;">${desc}</p>
        <button onclick="addToCart('${name}', '${price}'); closeProductDetail()" 
                style="width:100%; padding:12px; background:#ff4757; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
            THÊM VÀO GIỎ NGAY
        </button>
    `;
    modal.style.display = 'block';
}

// Hàm đóng bảng chi tiết
function closeProductDetail() {
    document.getElementById('product-detail-modal').style.display = 'none';
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
    modal.style.display = 'block';
}
function sendTelegramMessage(message) {
    const token = "8711185097:AAGNpNiha-FaDf-mZB9HtiBON1rW0iSz_K0"; // Token mới của BÁ-Luận bot
    const chatId = "7901882812"; // ID của bạn
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url).then(response => {
        if (!response.ok) {
            console.log("Lỗi gửi thông báo! Kiểm tra lại Token hoặc đã nhấn Start bot chưa.");
        }
    });
}
// Đoạn code giúp kéo chuột để xem sản phẩm trên máy tính
const slider = document.querySelector('.product-container'); // Hoặc tên class chứa các sản phẩm của bạn
let isDown = false;
let startDate;
let scrollLeft;

if (slider) {
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startDate = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startDate) * 2; // Nhân 2 để tốc độ lướt nhanh hơn
        slider.scrollLeft = scrollLeft - walk;
    });
}
function removeFromCart(index) {
    // 1. Xóa sản phẩm khỏi mảng
    cart.splice(index, 1);
    
    // 2. Cập nhật lại số lượng hiển thị trên icon giỏ hàng
    updateCartUI(); 
    
    // 3. Vẽ lại bảng danh sách sản phẩm trong giỏ hàng
    renderCartItems(); 
    
    // 4. Lưu vào máy khách (nếu cần)
    localStorage.setItem('cart', JSON.stringify(cart));
}