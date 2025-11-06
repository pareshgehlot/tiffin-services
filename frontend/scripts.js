const state = {
  apiBase: document.getElementById('api-base')?.value || 'http://localhost:3000',
  tokens: {
    admin: null,
    customer: null,
    driver: null
  },
  cache: {
    tiffins: [],
    plans: [],
    promotions: [],
    weeklyMenu: [],
    reviews: []
  }
};

const elements = {
  apiBase: document.getElementById('api-base'),
  heroHighlights: document.getElementById('hero-highlights'),
  heroMenu: document.getElementById('hero-menu'),
  promotionsGrid: document.getElementById('promotions-grid'),
  planGrid: document.getElementById('plan-grid'),
  reviewGrid: document.getElementById('review-grid'),
  orderForm: document.getElementById('order-form'),
  orderFeedback: document.getElementById('order-feedback'),
  orderTiffinSelect: document.getElementById('order-tiffin'),
  orderPlanSelect: document.getElementById('order-plan'),
  adminLoginForm: document.getElementById('admin-login-form'),
  adminLoginFeedback: document.getElementById('admin-login-feedback'),
  adminDashboard: document.getElementById('admin-dashboard'),
  adminCreateUserForm: document.getElementById('admin-create-user-form'),
  adminUserFeedback: document.getElementById('admin-user-feedback'),
  adminPromoForm: document.getElementById('admin-promo-form'),
  adminPromoFeedback: document.getElementById('admin-promo-feedback'),
  adminTiffinForm: document.getElementById('admin-tiffin-form'),
  adminTiffinFeedback: document.getElementById('admin-tiffin-feedback'),
  adminDeliveryForm: document.getElementById('admin-delivery-form'),
  adminDeliveryFeedback: document.getElementById('admin-delivery-feedback'),
  adminRefresh: document.getElementById('admin-refresh'),
  adminUserList: document.getElementById('admin-user-list'),
  adminOrderList: document.getElementById('admin-order-list'),
  adminDeliveryList: document.getElementById('admin-delivery-list'),
  customerLoginForm: document.getElementById('customer-login-form'),
  customerLoginFeedback: document.getElementById('customer-login-feedback'),
  customerDashboard: document.getElementById('customer-dashboard'),
  customerProfile: document.getElementById('customer-profile'),
  customerOrders: document.getElementById('customer-orders'),
  customerRefresh: document.getElementById('customer-refresh'),
  driverLoginForm: document.getElementById('driver-login-form'),
  driverLoginFeedback: document.getElementById('driver-login-feedback'),
  driverDashboard: document.getElementById('driver-dashboard'),
  driverDeliveries: document.getElementById('driver-deliveries'),
  driverRefresh: document.getElementById('driver-refresh')
};

document.getElementById('year').textContent = new Date().getFullYear().toString();

function setFeedback(target, message, type = 'error') {
  if (!target) return;
  target.textContent = message;
  target.classList.remove('success', 'error');
  if (type) {
    target.classList.add(type);
  }
}

function serializeForm(form) {
  const formData = new FormData(form);
  const payload = {};
  formData.forEach((value, key) => {
    if (payload[key]) {
      if (!Array.isArray(payload[key])) {
        payload[key] = [payload[key]];
      }
      payload[key].push(value);
    } else {
      payload[key] = value;
    }
  });

  Array.from(form.elements).forEach((element) => {
    if (!(element instanceof HTMLInputElement)) return;
    if (!element.name) return;
    if (element.type === 'checkbox') {
      payload[element.name] = element.checked;
    }
  });

  return payload;
}

async function apiFetch(path, options = {}, role) {
  const url = `${state.apiBase}${path}`;
  const config = { ...options };
  config.method = config.method || 'GET';
  config.headers = config.headers ? { ...config.headers } : {};

  if (role && state.tokens[role]) {
    config.headers['x-auth-token'] = state.tokens[role];
  }

  if (config.body && !(config.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value || 0);
}

function hydrateHero() {
  const highlights = elements.heroHighlights;
  const menuList = elements.heroMenu;
  if (highlights) {
    highlights.innerHTML = '';
    state.cache.promotions.slice(0, 3).forEach((promo) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${promo.title}</strong><br /><small>${promo.description}</small>`;
      highlights.appendChild(li);
    });
  }
  if (menuList) {
    menuList.innerHTML = '';
    const map = new Map(state.cache.tiffins.map((t) => [t.id, t.name]));
    state.cache.weeklyMenu.slice(0, 5).forEach((entry) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${entry.day.toUpperCase()}</strong> · ${map.get(entry.tiffinId) || entry.tiffinId}`;
      menuList.appendChild(li);
    });
  }
}

function renderPromotions() {
  if (!elements.promotionsGrid) return;
  elements.promotionsGrid.innerHTML = '';
  state.cache.promotions.forEach((promo) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>${promo.title}</h3>
      <p>${promo.description}</p>
      <div class="promo-meta">
        <span>${promo.discountPercent}% off</span>
        <span>${promo.validUntil ? new Date(promo.validUntil).toLocaleDateString() : 'Ongoing'}</span>
      </div>
    `;
    elements.promotionsGrid.appendChild(article);
  });
}

function renderPlans() {
  if (!elements.planGrid) return;
  elements.planGrid.innerHTML = '';
  state.cache.plans.forEach((plan) => {
    const perks = (plan.perks || []).map((perk) => `<li>• ${perk}</li>`).join('');
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>${plan.name}</h3>
      <p class="price">${formatCurrency(plan.price)}</p>
      <p><strong>${plan.billingCycle.toUpperCase()}</strong></p>
      <p>${plan.description}</p>
      <ul>${perks}</ul>
    `;
    elements.planGrid.appendChild(article);
  });
}

function renderReviews() {
  if (!elements.reviewGrid) return;
  elements.reviewGrid.innerHTML = '';
  state.cache.reviews.forEach((review) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</h3>
      <p>${review.comment}</p>
      <small>${review.author} · ${new Date(review.createdAt).toLocaleDateString()} · ${review.source}</small>
    `;
    elements.reviewGrid.appendChild(article);
  });
}

function refreshOrderFormOptions() {
  if (!elements.orderTiffinSelect || !elements.orderPlanSelect) return;
  elements.orderTiffinSelect.innerHTML = '';
  state.cache.tiffins.forEach((tiffin) => {
    const option = document.createElement('option');
    option.value = tiffin.id;
    option.textContent = `${tiffin.name} (${formatCurrency(tiffin.price)})`;
    elements.orderTiffinSelect.appendChild(option);
  });
  const existing = elements.orderPlanSelect.querySelectorAll('option:not(:first-child)');
  existing.forEach((opt) => opt.remove());
  state.cache.plans.forEach((plan) => {
    const option = document.createElement('option');
    option.value = plan.id;
    option.textContent = `${plan.name} – ${formatCurrency(plan.price)}`;
    elements.orderPlanSelect.appendChild(option);
  });
}

async function loadPublicData() {
  try {
    const data = await apiFetch('/customer/public/data');
    state.cache.tiffins = data.tiffins || [];
    state.cache.plans = data.plans || [];
    state.cache.promotions = data.promotions || [];
    state.cache.weeklyMenu = data.weeklyMenu || [];
    state.cache.reviews = data.reviews || [];
    hydrateHero();
    renderPromotions();
    renderPlans();
    renderReviews();
    refreshOrderFormOptions();
  } catch (error) {
    console.warn('Unable to load public data', error);
  }
}

function toggleDashboard(role, visible) {
  const dashboard = elements[`${role}Dashboard`];
  if (dashboard) {
    dashboard.hidden = !visible;
  }
}

async function loadAdminData() {
  if (!state.tokens.admin) return;
  try {
    const [users, orders, deliveries] = await Promise.all([
      apiFetch('/admin/users', {}, 'admin'),
      apiFetch('/admin/orders', {}, 'admin'),
      apiFetch('/admin/orders/deliveries', {}, 'admin')
    ]);
    renderAdminUsers(users);
    renderAdminOrders(orders);
    renderAdminDeliveries(deliveries);
  } catch (error) {
    setFeedback(elements.adminLoginFeedback, `Unable to refresh admin data: ${error.message}`);
  }
}

function renderAdminUsers(users) {
  if (!elements.adminUserList) return;
  elements.adminUserList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${user.name}</strong><br />
      <small>${user.role.toUpperCase()} · ${user.email || user.phone || 'No contact'}</small>
      <div style="margin-top:0.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="btn ghost" data-action="copy" data-id="${user.id}">Copy ID</button>
        <button class="btn ghost" data-action="delete" data-id="${user.id}">Remove</button>
      </div>
    `;
    elements.adminUserList.appendChild(li);
  });
}

function renderAdminOrders(orders) {
  if (!elements.adminOrderList) return;
  elements.adminOrderList.innerHTML = '';
  orders.forEach((order) => {
    const tiffin = state.cache.tiffins.find((item) => item.id === order.tiffinId);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${tiffin ? tiffin.name : order.tiffinId}</strong><br />
      <small>Status: ${order.status} · ${formatCurrency(order.total)}</small>
    `;
    elements.adminOrderList.appendChild(li);
  });
}

function renderAdminDeliveries(deliveries) {
  if (!elements.adminDeliveryList) return;
  elements.adminDeliveryList.innerHTML = '';
  deliveries.forEach((delivery) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${delivery.id}</strong><br />
      <small>Status: ${delivery.status} · Driver: ${delivery.driverId || 'Unassigned'}</small>
    `;
    elements.adminDeliveryList.appendChild(li);
  });
}

async function loadCustomerData() {
  if (!state.tokens.customer) return;
  try {
    const [profile, orders] = await Promise.all([
      apiFetch('/customer/me', {}, 'customer'),
      apiFetch('/customer/me/orders', {}, 'customer')
    ]);
    renderCustomerProfile(profile);
    renderCustomerOrders(orders);
  } catch (error) {
    setFeedback(elements.customerLoginFeedback, `Unable to refresh customer data: ${error.message}`);
  }
}

function renderCustomerProfile(profile) {
  if (!elements.customerProfile) return;
  const addresses = (profile.addresses || []).map((address) => {
    return `<li>${address.label ? `<strong>${address.label}</strong> – ` : ''}${address.street}, ${address.city} ${
      address.postalCode || ''
    }</li>`;
  });
  elements.customerProfile.innerHTML = `
    <p><strong>Name:</strong> ${profile.name}</p>
    <p><strong>Email:</strong> ${profile.email || '—'}</p>
    <p><strong>Phone:</strong> ${profile.phone || '—'}</p>
    <p><strong>Verified:</strong> ${profile.verified ? 'Yes' : 'Pending OTP'}</p>
    <div><strong>Addresses:</strong><ul class="mini-list">${addresses.join('') || '<li>No saved addresses yet.</li>'}</ul></div>
  `;
}

function renderCustomerOrders(orders) {
  if (!elements.customerOrders) return;
  elements.customerOrders.innerHTML = '';
  orders.forEach((order) => {
    const tiffin = state.cache.tiffins.find((item) => item.id === order.tiffinId);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${tiffin ? tiffin.name : order.tiffinId}</strong><br />
      <small>${new Date(order.createdAt).toLocaleString()} · ${order.status} · ${formatCurrency(order.total)}</small>
    `;
    elements.customerOrders.appendChild(li);
  });
}

async function loadDriverData() {
  if (!state.tokens.driver) return;
  try {
    const data = await apiFetch('/driver/assignments', {}, 'driver');
    renderDriverAssignments(data);
  } catch (error) {
    setFeedback(elements.driverLoginFeedback, `Unable to load driver data: ${error.message}`);
  }
}

function renderDriverAssignments(data) {
  if (!elements.driverDeliveries) return;
  const ordersById = new Map((data.orders || []).map((order) => [order.id, order]));
  elements.driverDeliveries.innerHTML = '';
  (data.deliveries || []).forEach((delivery) => {
    const order = ordersById.get(delivery.orderId);
    const tiffin = state.cache.tiffins.find((item) => item.id === order?.tiffinId);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${tiffin ? tiffin.name : delivery.orderId}</strong><br />
      <small>Status: ${delivery.status} · Scheduled: ${new Date(delivery.scheduledFor).toLocaleString()}</small>
      <div style="display:flex; gap:0.5rem; margin-top:0.5rem; flex-wrap:wrap;">
        <button class="btn ghost" data-action="mark-enroute" data-id="${delivery.id}">Mark enroute</button>
        <button class="btn secondary" data-action="mark-delivered" data-id="${delivery.id}">Mark delivered</button>
      </div>
    `;
    elements.driverDeliveries.appendChild(li);
  });
}

async function submitOrder(event) {
  event.preventDefault();
  if (!elements.orderForm) return;
  const data = serializeForm(elements.orderForm);
  const selectedTiffin = state.cache.tiffins.find((item) => item.id === data.tiffinId);
  const payload = {
    tiffinId: data.tiffinId,
    planId: data.planId || undefined,
    paymentMethod: data.paymentMethod || 'cash',
    guestEmail: data.guestEmail || undefined,
    guestPhone: data.guestPhone || undefined,
    total: selectedTiffin ? selectedTiffin.price : undefined
  };

  if (data.street || data.city || data.postalCode || data.instructions) {
    payload.deliveryAddress = {
      label: 'Default',
      street: data.street,
      city: data.city,
      postalCode: data.postalCode,
      instructions: data.instructions
    };
  }

  try {
    await apiFetch('/customer/order', { method: 'POST', body: payload }, state.tokens.customer ? 'customer' : undefined);
    elements.orderForm.reset();
    setFeedback(elements.orderFeedback, 'Order placed successfully. Keep an eye on your inbox!', 'success');
    loadAdminData();
    loadCustomerData();
  } catch (error) {
    setFeedback(elements.orderFeedback, `Unable to place order: ${error.message}`, 'error');
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();
  if (!elements.adminLoginForm) return;
  const payload = serializeForm(elements.adminLoginForm);
  try {
    const response = await apiFetch('/admin/login', { method: 'POST', body: payload });
    state.tokens.admin = response.token;
    setFeedback(elements.adminLoginFeedback, 'Logged in as admin.', 'success');
    toggleDashboard('admin', true);
    await loadAdminData();
  } catch (error) {
    setFeedback(elements.adminLoginFeedback, `Login failed: ${error.message}`, 'error');
  }
}

async function handleCreateUser(event) {
  event.preventDefault();
  if (!elements.adminCreateUserForm) return;
  const payload = serializeForm(elements.adminCreateUserForm);
  if (payload.password === '') {
    delete payload.password;
  }
  try {
    await apiFetch('/admin/users', { method: 'POST', body: payload }, 'admin');
    setFeedback(elements.adminUserFeedback, 'User saved successfully.', 'success');
    elements.adminCreateUserForm.reset();
    await loadAdminData();
  } catch (error) {
    setFeedback(elements.adminUserFeedback, `Unable to save user: ${error.message}`, 'error');
  }
}

async function handlePromotion(event) {
  event.preventDefault();
  if (!elements.adminPromoForm) return;
  const payload = serializeForm(elements.adminPromoForm);
  payload.discountPercent = Number(payload.discountPercent || 0);
  if (!payload.active) payload.active = false;
  try {
    await apiFetch('/admin/promotions/upsert', { method: 'POST', body: payload }, 'admin');
    setFeedback(elements.adminPromoFeedback, 'Promotion published.', 'success');
    elements.adminPromoForm.reset();
    await Promise.all([loadAdminData(), loadPublicData()]);
  } catch (error) {
    setFeedback(elements.adminPromoFeedback, `Unable to publish promotion: ${error.message}`, 'error');
  }
}

async function handleTiffin(event) {
  event.preventDefault();
  if (!elements.adminTiffinForm) return;
  const payload = serializeForm(elements.adminTiffinForm);
  payload.price = Number(payload.price || 0);
  payload.itemsIncluded = payload.itemsIncluded
    ? payload.itemsIncluded.split(',').map((item) => item.trim()).filter(Boolean)
    : [];
  try {
    await apiFetch('/admin/tiffins/upsert', { method: 'POST', body: payload }, 'admin');
    setFeedback(elements.adminTiffinFeedback, 'Tiffin saved.', 'success');
    elements.adminTiffinForm.reset();
    await Promise.all([loadAdminData(), loadPublicData()]);
  } catch (error) {
    setFeedback(elements.adminTiffinFeedback, `Unable to save tiffin: ${error.message}`, 'error');
  }
}

async function handleDelivery(event) {
  event.preventDefault();
  if (!elements.adminDeliveryForm) return;
  const payload = serializeForm(elements.adminDeliveryForm);
  try {
    await apiFetch('/admin/orders/deliveries/update', { method: 'POST', body: payload }, 'admin');
    setFeedback(elements.adminDeliveryFeedback, 'Delivery updated.', 'success');
    elements.adminDeliveryForm.reset();
    await loadAdminData();
  } catch (error) {
    setFeedback(elements.adminDeliveryFeedback, `Unable to update delivery: ${error.message}`, 'error');
  }
}

async function handleCustomerLogin(event) {
  event.preventDefault();
  if (!elements.customerLoginForm) return;
  const payload = serializeForm(elements.customerLoginForm);
  try {
    const response = await apiFetch('/customer/login', { method: 'POST', body: payload });
    state.tokens.customer = response.token;
    setFeedback(elements.customerLoginFeedback, 'Welcome back! Dashboard unlocked.', 'success');
    toggleDashboard('customer', true);
    await loadCustomerData();
  } catch (error) {
    setFeedback(elements.customerLoginFeedback, `Unable to login: ${error.message}`, 'error');
  }
}

async function handleDriverLogin(event) {
  event.preventDefault();
  if (!elements.driverLoginForm) return;
  const payload = serializeForm(elements.driverLoginForm);
  try {
    const response = await apiFetch('/driver/login', { method: 'POST', body: payload });
    state.tokens.driver = response.token;
    setFeedback(elements.driverLoginFeedback, 'Dispatch view unlocked.', 'success');
    toggleDashboard('driver', true);
    await loadDriverData();
  } catch (error) {
    setFeedback(elements.driverLoginFeedback, `Unable to login: ${error.message}`, 'error');
  }
}

async function handleAdminListClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.dataset.id;
  if (!id) return;
  if (target.dataset.action === 'copy') {
    navigator.clipboard?.writeText(id);
    setFeedback(elements.adminLoginFeedback, `Copied user id ${id}`, 'success');
  }
  if (target.dataset.action === 'delete') {
    try {
      await apiFetch(`/admin/users/${id}`, { method: 'DELETE' }, 'admin');
      setFeedback(elements.adminLoginFeedback, 'User removed.', 'success');
      await loadAdminData();
    } catch (error) {
      setFeedback(elements.adminLoginFeedback, `Unable to remove user: ${error.message}`, 'error');
    }
  }
}

async function handleDriverListClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.dataset.id;
  if (!id) return;
  const action = target.dataset.action;
  if (!action) return;
  let status;
  if (action === 'mark-enroute') status = 'enroute';
  if (action === 'mark-delivered') status = 'delivered';
  if (!status) return;
  try {
    await apiFetch('/driver/assignments/status', {
      method: 'PATCH',
      body: { id, status }
    }, 'driver');
    await loadDriverData();
  } catch (error) {
    setFeedback(elements.driverLoginFeedback, `Unable to update delivery: ${error.message}`, 'error');
  }
}

if (elements.apiBase) {
  elements.apiBase.addEventListener('change', () => {
    state.apiBase = elements.apiBase.value || 'http://localhost:3000';
    loadPublicData();
    loadAdminData();
    loadCustomerData();
    loadDriverData();
  });
}

if (elements.orderForm) {
  elements.orderForm.addEventListener('submit', submitOrder);
}

if (elements.adminLoginForm) {
  elements.adminLoginForm.addEventListener('submit', handleAdminLogin);
}

if (elements.adminCreateUserForm) {
  elements.adminCreateUserForm.addEventListener('submit', handleCreateUser);
}

if (elements.adminPromoForm) {
  elements.adminPromoForm.addEventListener('submit', handlePromotion);
}

if (elements.adminTiffinForm) {
  elements.adminTiffinForm.addEventListener('submit', handleTiffin);
}

if (elements.adminDeliveryForm) {
  elements.adminDeliveryForm.addEventListener('submit', handleDelivery);
}

if (elements.adminRefresh) {
  elements.adminRefresh.addEventListener('click', (event) => {
    event.preventDefault();
    loadAdminData();
  });
}

if (elements.adminUserList) {
  elements.adminUserList.addEventListener('click', handleAdminListClick);
}

if (elements.customerLoginForm) {
  elements.customerLoginForm.addEventListener('submit', handleCustomerLogin);
}

if (elements.customerRefresh) {
  elements.customerRefresh.addEventListener('click', (event) => {
    event.preventDefault();
    loadCustomerData();
  });
}

if (elements.driverLoginForm) {
  elements.driverLoginForm.addEventListener('submit', handleDriverLogin);
}

if (elements.driverRefresh) {
  elements.driverRefresh.addEventListener('click', (event) => {
    event.preventDefault();
    loadDriverData();
  });
}

if (elements.driverDeliveries) {
  elements.driverDeliveries.addEventListener('click', handleDriverListClick);
}

loadPublicData();
