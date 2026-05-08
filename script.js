let cart = [];

function showSection(index) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    pages[index].classList.add('active');
    document.getElementById('cart-modal').style.display = 'none';
}

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    alert("Đã thêm " + name + " vào giỏ!");
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
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
    if (billModal) {
        billModal.style.display = 'flex';
    }

    cart = [];
    updateCartUI();

    setTimeout(() => {
        if (billModal) { billModal.style.display = 'none'; }
        document.getElementById('cus-name').value = "";
        document.getElementById('cus-phone').value = "";
        document.getElementById('cus-address').value = "";
        document.getElementById('cus-note').value = "";
        document.getElementById('cus-size').value = "";
    }, 5000);
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

function sendTelegramMessage(message) {
    const token = "8711185097:AAGNpNiha-FaDf-mZB9HtiBON1rW0iSz_K0";
    const chatId = "7901882812";
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    fetch(url);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI(); 
    renderCartItems(); 
}

window.onload = () => {
    showSection(0);
};
