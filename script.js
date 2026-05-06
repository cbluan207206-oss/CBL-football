let cart = [];

// 1. Hàm chuyển trang (Giữ nguyên logic lật trang PowerPoint của bạn)
function showSection(index) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    pages[index].classList.add('active');
    
    // Đóng giỏ hàng luôn nếu đang mở khi chuyển trang
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.style.display = 'none';
}

// 2. Hàm Thêm sản phẩm vào mảng giỏ hàng
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    alert("Đã thêm " + name + " vào giỏ!");
}

// 3. Cập nhật số hiển thị trên icon giỏ hàng
function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.length;
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
    cart.forEach((item, index) => {
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
        // Chuyển giá từ chuỗi "500.000" thành số 500000 để tính toán
        total += parseInt(item.price.toString().replace(/\./g, ''));
    });

    list.innerHTML = html;
    totalEl.innerText = total.toLocaleString('vi-VN') + "đ";
}

// 6. Hàm Đặt hàng
function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'block';
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
            <hr style="border: 0.5px dashed #ddd;">
            <p><b>Người nhận:</b> ${name}</p>
            <p><b>SĐT:</b> ${phone}</p>
            <p><b>Địa chỉ:</b> ${address}</p>
            <p><b>Ghi chú:</b> ${note || 'Không có'}</p>
        `;
    }

    document.getElementById('checkout-modal').style.display = 'none';
    const billModal = document.getElementById('bill-modal');
    if (billModal) billModal.style.display = 'block';

    cart = [];
    updateCartUI();

    setTimeout(() => {
        if (billModal) billModal.style.display = 'none';
        document.getElementById('cus-name').value = "";
        document.getElementById('cus-phone').value = "";
        document.getElementById('cus-address').value = "";
        document.getElementById('cus-note').value = "";
        document.getElementById('cus-size').value = "";
    }, 5000);
}

// 7. Hàm gửi Telegram
function sendTelegramMessage(message) {
    const token = "8711185097:AAGNpNiha-FaDf-mZB9HtiBON1rW0iSz_K0"; 
    const chatId = "7901882812"; 
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url).catch(err => console.error("Lỗi gửi Telegram:", err));
}

// 8. Hàm hiện thông tin chi tiết (Chỉ giữ lại 1 bản duy nhất)
function showProductDetail(name, price, size, description, image) {
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('detail-content');
    
    // Đưa nội dung vào, chú ý phần mô tả phải nằm trong vùng cuộn
    content.innerHTML = `
        <img src="${image}" style="width:100%; border-radius:10px; margin-bottom:15px;">
        <h2 style="margin-bottom:10px;">${name}</h2>
        <p style="color:#ff4757; font-weight:bold; font-size:1.2rem; margin-bottom:5px;">${price}đ</p>
        <p style="margin-bottom:15px;"><strong>Size:</strong> ${size}</p>
        <div style="background:#f9f9f9; padding:10px; border-radius:8px;">
            <p>${description}</p>
        </div>
        <button onclick="addToCart('${name}', '${price}'); closeProductDetail();" 
                style="width:100%; padding:15px; background:#27ae60; color:white; border:none; border-radius:10px; font-weight:bold; margin-top:20px; cursor:pointer;">
            THÊM VÀO GIỎ NGAY
        </button>
    `;
    
    modal.style.display = 'block';
    // Reset thanh cuộn lên đầu mỗi khi mở sản phẩm mới
    content.scrollTop = 0;
}


function closeProductDetail() {
    document.getElementById('product-detail-modal').style.display = 'none';
}

// 9. Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI(); 
    renderCartItems(); 
}

// 10. Kéo chuột để lướt sản phẩm (Đã sửa Class cho khớp với CSS)
const slider = document.querySelector('.product-grid'); 
let isDown = false;
let startX;
let scrollLeft;

if (slider) {
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => isDown = false);
    slider.addEventListener('mouseup', () => isDown = false);
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; 
        slider.scrollLeft = scrollLeft - walk;
    });
}

window.onload = () => {
    showSection(0);
};
