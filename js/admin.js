/* ═══════════════════════════════════════════════════
   iFixServices Admin Management Portal JavaScript
   ═══════════════════════════════════════════════════ */

(function() {
  'use strict';

  // Check authentication session
  function verifySession() {
    const isAuth = sessionStorage.getItem('ifix_admin_logged_in') === 'true';
    if (!isAuth) {
      // If not authenticated, open admin login modal or prompt
      if (typeof window.openAdminLoginModal === 'function') {
        window.openAdminLoginModal();
      } else {
        alert("Admin Authentication Required. Redirecting to store home...");
        window.location.href = "index.html";
      }
    }
  }

  verifySession();

  // Storage Keys
  const STORAGE_KEY = 'ifix_catalog_services';

  // Preset Default Master Catalog Items if localStorage is empty
  const defaultMasterCatalog = [
    // MacBook
    { id: 'mb-1', category: 'macbook', title: 'MacBook Retina Screen Replacement', price: 4999, originalPrice: 6500, badge: 'MOST POPULAR', tag: '1-YEAR WARRANTY • 180 DAYS', img: 'images/placeholder-macbook.png', stock: 'instock' },
    { id: 'mb-2', category: 'macbook', title: 'MacBook High-Capacity Battery Replacement', price: 2999, originalPrice: 3800, badge: 'GENUINE OEM', tag: '100% HEALTH • 1-YEAR WARRANTY', img: 'images/placeholder-macbook.png', stock: 'instock' },
    { id: 'mb-3', category: 'macbook', title: 'Keyboard & Trackpad Repair', price: 1999, originalPrice: 2800, badge: 'QUICK FIX', tag: 'SAME DAY SERVICE', img: 'images/placeholder-macbook.png', stock: 'instock' },
    { id: 'mb-4', category: 'macbook', title: 'Logic Board Micro-Soldering Repair', price: 5999, originalPrice: 8500, badge: 'CHIP LEVEL', tag: 'ADVANCED AUDIT', img: 'images/placeholder-macbook.png', stock: 'instock' },
    { id: 'mb-5', category: 'macbook', title: 'Liquid & Water Damage Decontamination', price: 2999, originalPrice: 4200, badge: 'LIQUID RESCUE', tag: 'ULTRASONIC CLEAN', img: 'images/placeholder-macbook.png', stock: 'instock' },
    
    // iPhone
    { id: 'ip-1', category: 'iphone', title: 'iPhone OLED Display Screen Replacement', price: 2999, originalPrice: 4500, badge: 'MOST POPULAR', tag: 'SUPER RETINA XDR OEM', img: 'images/placeholder-iphone.png', stock: 'instock' },
    { id: 'ip-2', category: 'iphone', title: 'High-Capacity Battery Replacement', price: 1499, originalPrice: 2200, badge: '100% HEALTH', tag: 'GENUINE CAPACITY', img: 'images/placeholder-iphone.png', stock: 'instock' },
    { id: 'ip-3', category: 'iphone', title: 'Rear Back Glass Laser Replacement', price: 1999, originalPrice: 2800, badge: 'LASER FIX', tag: 'LASER SEPARATION', img: 'images/placeholder-iphone.png', stock: 'instock' },
    { id: 'ip-4', category: 'iphone', title: '48MP Camera Module & Glass Replacement', price: 1799, originalPrice: 2400, badge: '48MP SENSOR', tag: 'OPTICAL STABILIZATION', img: 'images/placeholder-iphone.png', stock: 'instock' },
    { id: 'ip-5', category: 'iphone', title: 'Face ID & TrueDepth Sensor Repair', price: 2499, originalPrice: 3500, badge: 'BIOMETRIC', tag: 'DOT PROJECTOR FIX', img: 'images/placeholder-iphone.png', stock: 'instock' },

    // CCTV
    { id: 'cam-1', category: 'cctv', title: '4K Ultra HD Indoor Dome IP Camera', price: 2499, originalPrice: 3499, badge: 'MOST POPULAR', tag: '4K ULTRA HD • AUDIO MIC', img: 'images/placeholder-cctv.png', stock: 'instock' },
    { id: 'cam-2', category: 'cctv', title: 'Outdoor Color Night Vision Bullet Camera', price: 2799, originalPrice: 3800, badge: 'NIGHT VISION', tag: 'WEATHERPROOF IP67', img: 'images/placeholder-cctv.png', stock: 'instock' },
    { id: 'cam-3', category: 'cctv', title: '360° Pan-Tilt-Zoom (PTZ) Speed Dome', price: 4999, originalPrice: 6500, badge: '360 COVERAGE', tag: 'OPTICAL ZOOM & AUTO TRACK', img: 'images/placeholder-cctv.png', stock: 'instock' },
    { id: 'cam-4', category: 'cctv', title: '8-Channel PoE NVR Security Recorder 2TB', price: 8999, originalPrice: 12000, badge: 'PRO RECORDING', tag: '24/7 ULTRA HD RECORDING', img: 'images/placeholder-cctv.png', stock: 'instock' },

    // Apple Watch
    { id: 'wat-1', category: 'watch', title: 'OLED Display & Sapphire Glass Replacement', price: 2199, originalPrice: 3400, badge: 'MOST POPULAR', tag: 'GENUINE SAPPHIRE OLED', img: 'images/placeholder-watch.png', stock: 'instock' },
    { id: 'wat-2', category: 'watch', title: 'High-Performance Watch Battery Replacement', price: 1299, originalPrice: 1900, badge: '100% CAPACITY', tag: 'ALL-DAY BATTERY RENEWAL', img: 'images/placeholder-watch.png', stock: 'instock' },
    { id: 'wat-3', category: 'watch', title: 'Digital Crown & Side Button Haptic Repair', price: 999, originalPrice: 1500, badge: 'HAPTIC FIX', tag: 'PRECISION DIAL RESTORE', img: 'images/placeholder-watch.png', stock: 'instock' },
    { id: 'wat-4', category: 'watch', title: 'Rear Heart Rate Sensor & Sapphire Glass', price: 1599, originalPrice: 2200, badge: 'BIO SENSOR', tag: 'OPTICAL SENSOR REPAIR', img: 'images/placeholder-watch.png', stock: 'instock' }
  ];

  // Helper: Get Catalog Data from localStorage
  function getCatalogServices() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMasterCatalog));
      return defaultMasterCatalog;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultMasterCatalog;
    }
  }

  // Helper: Save Catalog Data to localStorage
  function saveCatalogServices(services) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    renderAdminTable();
    updateStatsCounters();
  }

  // State Variables
  let currentServices = getCatalogServices();

  // DOM Elements
  const tableBody = document.getElementById('admin-services-table-body');
  const searchInput = document.getElementById('admin-search-input');
  const categoryFilter = document.getElementById('admin-category-filter');
  const stockFilter = document.getElementById('admin-stock-filter');
  const resetBtn = document.getElementById('reset-catalog-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');

  // Stats Counters
  const statTotal = document.getElementById('stat-total-services');
  const statInStock = document.getElementById('stat-instock-services');
  const statOutOfStock = document.getElementById('stat-outofstock-services');

  // Modal Elements
  const modalOverlay = document.getElementById('product-form-modal-overlay');
  const modalTitle = document.getElementById('product-modal-title');
  const modalForm = document.getElementById('admin-product-form');
  const modalClose = document.getElementById('product-modal-close');
  const modalCancel = document.getElementById('product-modal-cancel');
  const openAddHeroBtn = document.getElementById('add-service-hero-btn');
  const openAddBtn = document.getElementById('open-add-modal-btn');

  // Form Fields
  const fieldId = document.getElementById('form-product-id');
  const fieldTitle = document.getElementById('form-title');
  const fieldCategory = document.getElementById('form-category');
  const fieldStock = document.getElementById('form-stock');
  const fieldPrice = document.getElementById('form-price');
  const fieldOriginalPrice = document.getElementById('form-original-price');
  const fieldBadge = document.getElementById('form-badge');
  const fieldTag = document.getElementById('form-tag');
  const fieldImageFile = document.getElementById('form-image-file');
  const fieldImageUrl = document.getElementById('form-image-url');
  const fieldImagePreview = document.getElementById('form-image-preview');

  let currentBase64Image = '';

  // Render Stats Counters
  function updateStatsCounters() {
    const services = getCatalogServices();
    if (statTotal) statTotal.textContent = services.length;
    
    const instockCount = services.filter(s => (s.stock || 'instock') === 'instock').length;
    const outofstockCount = services.length - instockCount;
    
    if (statInStock) statInStock.textContent = instockCount;
    if (statOutOfStock) statOutOfStock.textContent = outofstockCount;
  }

  // Render Table Rows
  function renderAdminTable() {
    if (!tableBody) return;
    const services = getCatalogServices();
    
    const query = (searchInput?.value || '').toLowerCase().trim();
    const catVal = categoryFilter?.value || 'all';
    const stockVal = stockFilter?.value || 'all';

    const filtered = services.filter(srv => {
      const matchQuery = srv.title.toLowerCase().includes(query) || (srv.badge || '').toLowerCase().includes(query) || (srv.id || '').toLowerCase().includes(query);
      const matchCat = catVal === 'all' || srv.category === catVal;
      const sStock = srv.stock || 'instock';
      const matchStock = stockVal === 'all' || sStock === stockVal;
      return matchQuery && matchCat && matchStock;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 40px; color: #888888;">
            No services found matching the selected filters.
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    filtered.forEach(srv => {
      const isOut = (srv.stock || 'instock') === 'outofstock';
      const stockBadge = isOut 
        ? `<span class="stock-pill stock-pill--outofstock">Out of Stock</span>`
        : `<span class="stock-pill stock-pill--instock">In Stock</span>`;

      const imgPath = srv.img || getCategoryPlaceholder(srv.category);

      html += `
        <tr data-id="${srv.id}">
          <td>
            <img src="${imgPath}" alt="${srv.title}" class="admin-table__img-thumb">
          </td>
          <td>
            <strong style="color:#111111; font-weight:600;">${srv.title}</strong>
            <div style="font-size:11px; color:#888888; margin-top:2px;">ID: ${srv.id}</div>
          </td>
          <td>
            <span style="font-size:11px; font-weight:700; text-transform:uppercase; color:#736450;">${srv.category}</span>
          </td>
          <td>
            <strong>₹${Number(srv.price).toLocaleString()}</strong>
          </td>
          <td>
            <span style="color:#888888;">${srv.originalPrice ? '₹' + Number(srv.originalPrice).toLocaleString() : '—'}</span>
          </td>
          <td>
            <span style="font-size:10px; font-weight:700; background:#f0eee8; padding:3px 8px; border-radius:2px;">${srv.badge || 'GENUINE'}</span>
          </td>
          <td>
            ${stockBadge}
          </td>
          <td>
            <div class="admin-action-btn-group">
              <button type="button" class="admin-action-icon-btn toggle-stock-btn" data-id="${srv.id}" title="${isOut ? 'Mark In Stock' : 'Mark Out of Stock'}">
                ${isOut ? '✅' : '🚫'}
              </button>
              <button type="button" class="admin-action-icon-btn edit-product-btn" data-id="${srv.id}" title="Edit Service">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="admin-action-icon-btn admin-action-icon-btn--danger delete-product-btn" data-id="${srv.id}" title="Delete Service">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
    attachTableEventListeners();
  }

  function getCategoryPlaceholder(cat) {
    if (cat === 'iphone') return 'images/placeholder-iphone.png';
    if (cat === 'watch') return 'images/placeholder-watch.png';
    if (cat === 'cctv') return 'images/placeholder-cctv.png';
    if (cat === 'macbook') return 'images/placeholder-macbook.png';
    return 'images/service-placeholder.png';
  }

  // Table Action Buttons Listeners
  function attachTableEventListeners() {
    // Toggle Stock Status
    document.querySelectorAll('.toggle-stock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const services = getCatalogServices();
        const srv = services.find(s => s.id === id);
        if (srv) {
          srv.stock = (srv.stock || 'instock') === 'instock' ? 'outofstock' : 'instock';
          saveCatalogServices(services);
          showToast('Stock Status Updated', `${srv.title} is now ${srv.stock === 'outofstock' ? 'Out of Stock' : 'In Stock'}.`);
        }
      });
    });

    // Edit Product
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        openEditModal(id);
      });
    });

    // Delete Product
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const services = getCatalogServices();
        const srv = services.find(s => s.id === id);
        if (srv && confirm(`Are you sure you want to delete "${srv.title}"?`)) {
          const updated = services.filter(s => s.id !== id);
          saveCatalogServices(updated);
          showToast('Service Deleted', `"${srv.title}" has been removed from catalog.`);
        }
      });
    });
  }

  // Open Modal for Editing
  function openEditModal(id) {
    const services = getCatalogServices();
    const srv = services.find(s => s.id === id);
    if (!srv) return;

    modalTitle.textContent = "Edit Service Details";
    fieldId.value = srv.id;
    fieldTitle.value = srv.title;
    fieldCategory.value = srv.category;
    fieldStock.value = srv.stock || 'instock';
    fieldPrice.value = srv.price;
    fieldOriginalPrice.value = srv.originalPrice || '';
    fieldBadge.value = srv.badge || '';
    fieldTag.value = srv.tag || '';
    fieldImageUrl.value = srv.img || '';
    fieldImageFile.value = '';
    
    currentBase64Image = srv.img || getCategoryPlaceholder(srv.category);
    fieldImagePreview.src = currentBase64Image;

    modalOverlay.classList.add('active');
  }

  // Open Modal for Adding New Product
  function openAddModal() {
    modalTitle.textContent = "Add New Service";
    modalForm.reset();
    fieldId.value = 'custom-' + Date.now();
    fieldStock.value = 'instock';
    currentBase64Image = getCategoryPlaceholder('macbook');
    fieldImagePreview.src = currentBase64Image;
    modalOverlay.classList.add('active');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  // Handle Image File Input (Base64 conversion)
  if (fieldImageFile) {
    fieldImageFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          currentBase64Image = evt.target.result;
          fieldImagePreview.src = currentBase64Image;
          fieldImageUrl.value = '';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Form Submit
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = fieldId.value;
      const title = fieldTitle.value.trim();
      const category = fieldCategory.value;
      const stock = fieldStock.value;
      const price = parseFloat(fieldPrice.value);
      const originalPrice = fieldOriginalPrice.value ? parseFloat(fieldOriginalPrice.value) : null;
      const badge = fieldBadge.value.trim() || 'GENUINE OEM';
      const tag = fieldTag.value.trim() || 'CERTIFIED SERVICE';
      const customUrl = fieldImageUrl.value.trim();

      const img = customUrl || currentBase64Image || getCategoryPlaceholder(category);

      const services = getCatalogServices();
      const existingIdx = services.findIndex(s => s.id === id);

      const serviceObj = {
        id,
        category,
        title,
        price,
        originalPrice,
        badge,
        tag,
        img,
        stock
      };

      if (existingIdx >= 0) {
        services[existingIdx] = serviceObj;
        showToast('Service Updated', `"${title}" has been updated.`);
      } else {
        services.unshift(serviceObj);
        showToast('New Service Added', `"${title}" has been added to catalog.`);
      }

      saveCatalogServices(services);
      closeModal();
    });
  }

  // Filter Event Listeners
  if (searchInput) searchInput.addEventListener('input', renderAdminTable);
  if (categoryFilter) categoryFilter.addEventListener('change', renderAdminTable);
  if (stockFilter) stockFilter.addEventListener('change', renderAdminTable);

  // Modal Open/Close Buttons
  if (openAddHeroBtn) openAddHeroBtn.addEventListener('click', openAddModal);
  if (openAddBtn) openAddBtn.addEventListener('click', openAddModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);

  // Reset Catalog to Factory Defaults
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Reset catalog to factory defaults? All custom edits will be restored.")) {
        localStorage.removeItem(STORAGE_KEY);
        currentServices = getCatalogServices();
        renderAdminTable();
        updateStatsCounters();
        showToast('Catalog Reset', 'Restored factory default catalog services.');
      }
    });
  }

  // Logout Button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('ifix_admin_logged_in');
      showToast('Logged Out', 'Admin session ended.');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    });
  }

  // Toast Notification Helper
  function showToast(title, desc) {
    const toast = document.getElementById('toast-notification');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');
    if (!toast) return;

    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }

  // Initial Render
  renderAdminTable();
  updateStatsCounters();

})();
