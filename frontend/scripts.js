const apiInput = document.getElementById('api-base');
let apiBase = apiInput?.value || 'http://localhost:3000';
let adminToken = null;

const adminLoginForm = document.getElementById('admin-login-form');
const adminLoginFeedback = document.getElementById('admin-login-feedback');
const adminTokenDisplay = document.getElementById('admin-token');
const adminTokenValue = document.getElementById('admin-token-value');
const tiffinForm = document.getElementById('tiffin-form');
const tiffinFeedback = document.getElementById('tiffin-feedback');
const promotionForm = document.getElementById('promotion-form');
const promotionFeedback = document.getElementById('promotion-feedback');
const paymentForm = document.getElementById('payment-form');
const paymentFeedback = document.getElementById('payment-feedback');
const signupForm = document.getElementById('customer-signup-form');
const signupFeedback = document.getElementById('customer-signup-feedback');
const orderForm = document.getElementById('order-form');
const orderFeedback = document.getElementById('order-feedback');
const weeklyMenuList = document.getElementById('weekly-menu-list');
const tiffinList = document.getElementById('tiffin-list');
const promotionList = document.getElementById('promotion-list');
const plansContainer = document.getElementById('plans');
const reviewsGrid = document.getElementById('reviews-grid');

function setFeedback(element, message, success = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = success ? '#4ade80' : '#f97316';
}

function serializeForm(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

async function apiFetch(path, options = {}) {
  const url = `${apiBase}${path}`;
  const headers = options.headers ? { ...options.headers } : {};
  if (!(options.body instanceof FormData) && options.body && typeof options.body !== 'string') {
    options.body = JSON.stringify(options.body);
    headers['Content-Type'] = 'application/json';
  }
  if (adminToken) {
    headers['x-auth-token'] = adminToken;
  }
  options.headers = headers;
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

async function refreshPublicData() {
  try {
    const [weeklyMenu, tiffins, promotions, plans, reviews] = await Promise.all([
      apiFetch('/public/weekly-menu'),
      apiFetch('/public/tiffins'),
      apiFetch('/public/promotions'),
      apiFetch('/public/plans'),
      apiFetch('/public/reviews')
    ]);
    renderWeeklyMenu(weeklyMenu);
    renderTiffins(tiffins);
    renderPromotions(promotions);
    renderPlans(plans);
    renderReviews(reviews);
  } catch (error) {
    console.warn('Unable to load public data', error);
  }
}

function renderWeeklyMenu(menu) {
  if (!weeklyMenuList) return;
  weeklyMenuList.innerHTML = '';
  menu.forEach((entry) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${entry.day.toUpperCase()}</strong> · <span>${entry.tiffinId}</span>`;
    weeklyMenuList.appendChild(item);
  });
}

function renderTiffins(tiffins) {
  if (!tiffinList) return;
  tiffinList.innerHTML = '';
  tiffins.forEach((tiffin) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${tiffin.name}</strong><br /><small>${tiffin.itemsIncluded?.join(', ')}</small><br /><span>$${tiffin.price.toFixed(2)}</span>`;
    tiffinList.appendChild(item);
  });
}

function renderPromotions(promotions) {
  if (!promotionList) return;
  promotionList.innerHTML = '';
  promotions.forEach((promo) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${promo.title}</strong> · ${promo.discountPercent}% off<br /><small>${promo.description}</small>`;
    promotionList.appendChild(item);
  });
}

function renderPlans(plans) {
  if (!plansContainer) return;
  plansContainer.innerHTML = '';
  plans.forEach((plan) => {
    const card = document.createElement('article');
    card.className = 'plan-card';
    card.innerHTML = `
      <h3>${plan.name}</h3>
      <p class="plan-price">$${plan.price.toFixed(2)}</p>
      <p><strong>${plan.billingCycle.toUpperCase()}</strong></p>
      <ul>${(plan.perks || []).map((perk) => `<li>${perk}</li>`).join('')}</ul>
    `;
    plansContainer.appendChild(card);
  });
}

function renderReviews(reviews) {
  if (!reviewsGrid) return;
  reviewsGrid.innerHTML = '';
  reviews.forEach((review) => {
    const card = document.createElement('article');
    card.innerHTML = `
      <h3>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</h3>
      <p>${review.comment}</p>
      <small>${review.author} · ${new Date(review.createdAt).toLocaleDateString()} · ${review.source}</small>
    `;
    reviewsGrid.appendChild(card);
  });
}

apiInput?.addEventListener('change', () => {
  apiBase = apiInput.value || 'http://localhost:3000';
  refreshPublicData();
});

adminLoginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = serializeForm(adminLoginForm);
  try {
    const response = await apiFetch('/admin/login', { method: 'POST', body: data });
    adminToken = response.token;
    if (adminTokenDisplay) {
      adminTokenDisplay.hidden = false;
      adminTokenValue.textContent = adminToken;
    }
    setFeedback(adminLoginFeedback, 'Admin logged in successfully.', true);
  } catch (error) {
    setFeedback(adminLoginFeedback, 'Login failed: ' + error.message);
  }
});

tiffinForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = serializeForm(tiffinForm);
  data.price = parseFloat(data.price || '0');
  data.itemsIncluded = data.itemsIncluded
    ? data.itemsIncluded.split(',').map((item) => item.trim()).filter(Boolean)
    : [];
  try {
    await apiFetch('/admin/tiffins/upsert', { method: 'POST', body: data });
    setFeedback(tiffinFeedback, 'Tiffin saved successfully.', true);
    tiffinForm.reset();
    refreshPublicData();
  } catch (error) {
    setFeedback(tiffinFeedback, 'Unable to save tiffin: ' + error.message);
  }
});

promotionForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = serializeForm(promotionForm);
  data.discountPercent = parseFloat(data.discountPercent || '0');
  try {
    await apiFetch('/admin/promotions/upsert', { method: 'POST', body: data });
    setFeedback(promotionFeedback, 'Promotion published.', true);
    promotionForm.reset();
    refreshPublicData();
  } catch (error) {
    setFeedback(promotionFeedback, 'Unable to publish promotion: ' + error.message);
  }
});

paymentForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = serializeForm(paymentForm);
  const payload = {
    allowCashOnDelivery: !!paymentForm.allowCashOnDelivery.checked,
    allowCreditCard: !!paymentForm.allowCreditCard.checked,
    allowInterac: !!paymentForm.allowInterac.checked,
    creditCardProcessor: data.creditCardProcessor || undefined,
    processorPublicKey: data.processorPublicKey || undefined,
    processorSecretKey: data.processorSecretKey || undefined,
    interacRecipientEmail: data.interacRecipientEmail || undefined,
    notes: data.notes || undefined
  };
  try {
    await apiFetch('/admin/settings/payment', { method: 'POST', body: payload });
    setFeedback(paymentFeedback, 'Payment settings saved.', true);
  } catch (error) {
    setFeedback(paymentFeedback, 'Unable to save settings: ' + error.message);
  }
});

signupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = serializeForm(signupForm);
  if (!data.email && !data.phone) {
    setFeedback(signupFeedback, 'Provide at least an email or phone number.');
    return;
  }
  try {
    const response = await apiFetch('/customer/signup', { method: 'POST', body: data });
    const { profile, otpSent } = response;
    setFeedback(
      signupFeedback,
      `Account created. ID: ${profile.id}. ${otpSent ? 'OTP sent to phone.' : ''}`,
      true
    );
    if (orderForm) {
      orderForm.customerId.value = profile.id;
    }
  } catch (error) {
    setFeedback(signupFeedback, 'Signup failed: ' + error.message);
  }
});

orderForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = serializeForm(orderForm);
  const payload = {
    customerId: data.customerId || undefined,
    guestEmail: data.guestEmail || undefined,
    guestPhone: data.guestPhone || undefined,
    tiffinId: data.tiffinId,
    planId: data.planId || undefined,
    paymentMethod: data.paymentMethod,
    total: parseFloat(data.total || '0')
  };
  if (data.label && data.street && data.city && data.postalCode) {
    payload.deliveryAddress = {
      label: data.label,
      street: data.street,
      city: data.city,
      postalCode: data.postalCode,
      instructions: data.instructions || undefined
    };
  }
  try {
    const response = await apiFetch('/customer/order', { method: 'POST', body: payload });
    setFeedback(orderFeedback, `Order placed. ID: ${response.id}`, true);
    orderForm.reset();
  } catch (error) {
    setFeedback(orderFeedback, 'Unable to place order: ' + error.message);
  }
});

refreshPublicData();
