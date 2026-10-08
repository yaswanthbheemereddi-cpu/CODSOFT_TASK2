const API = '/api/contacts';

async function loadContacts() {
  const search = document.getElementById('contact-search').value;
  const category = document.getElementById('category-filter').value;
  const is_favorite = document.getElementById('fav-filter').value;
  const sortBy = document.getElementById('sort-filter').value;

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (is_favorite) params.append('is_favorite', is_favorite);
  if (sortBy) params.append('sortBy', sortBy);

  const res = await fetch(`${API}?${params.toString()}`);
  const data = await res.json();
  const list = document.getElementById('contact-list');

  // Update stats
  updateStats();

  if (!data.data || data.data.length === 0) {
    list.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">No contacts found. Click "Add New Contact" to create one!</div>';
    return;
  }

  list.innerHTML = data.data.map(c => `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-name">${escapeHtml(c.name)}</div>
          <div class="card-title">${escapeHtml(c.job_title || '')} ${c.company ? '@ ' + escapeHtml(c.company) : ''}</div>
        </div>
        <button class="star-btn ${c.is_favorite ? 'fav' : ''}" onclick="toggleFav(${c.id})">★</button>
      </div>

      <span class="category-tag cat-${c.category}">${c.category}</span>

      <div class="card-info">
        <div class="info-row">📧 <span>${escapeHtml(c.email)}</span></div>
        <div class="info-row">📞 <span>${escapeHtml(c.phone)}</span></div>
        ${c.address ? `<div class="info-row">📍 <span>${escapeHtml(c.address)}</span></div>` : ''}
      </div>

      <div class="card-actions">
        <button class="btn btn-sm btn-secondary" onclick='editContact(${JSON.stringify(c)})'>Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteContact(${c.id}, '${escapeHtml(c.name)}')">Delete</button>
      </div>
    </div>
  `).join('');
}

async function updateStats() {
  const res = await fetch(`${API}?limit=500`);
  const data = await res.json();
  const all = data.data || [];

  document.getElementById('stat-total').innerText = all.length;
  document.getElementById('stat-work').innerText = all.filter(c => c.category === 'work').length;
  document.getElementById('stat-personal').innerText = all.filter(c => c.category === 'personal').length;
  document.getElementById('stat-fav').innerText = all.filter(c => c.is_favorite === 1).length;
}

function openAddModal() {
  document.getElementById('modal-title').innerText = 'Add New Contact';
  document.getElementById('c-id').value = '';
  document.getElementById('contact-form').reset();
  document.getElementById('modal').classList.remove('hidden');
}

function editContact(c) {
  document.getElementById('modal-title').innerText = 'Edit Contact';
  document.getElementById('c-id').value = c.id;
  document.getElementById('c-name').value = c.name;
  document.getElementById('c-email').value = c.email;
  document.getElementById('c-phone').value = c.phone;
  document.getElementById('c-company').value = c.company || '';
  document.getElementById('c-title').value = c.job_title || '';
  document.getElementById('c-category').value = c.category || 'personal';
  document.getElementById('c-address').value = c.address || '';
  document.getElementById('modal').classList.remove('hidden');
}

async function saveContact(e) {
  e.preventDefault();
  const id = document.getElementById('c-id').value;
  const payload = {
    name: document.getElementById('c-name').value,
    email: document.getElementById('c-email').value,
    phone: document.getElementById('c-phone').value,
    company: document.getElementById('c-company').value,
    job_title: document.getElementById('c-title').value,
    category: document.getElementById('c-category').value,
    address: document.getElementById('c-address').value
  };

  const isEdit = Boolean(id);
  const url = isEdit ? `${API}/${id}` : API;
  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await res.json();
  if (result.success) {
    alert(isEdit ? 'Contact updated!' : 'Contact added successfully!');
    closeModal();
    loadContacts();
  } else {
    alert('Error: ' + (result.message || result.errors?.join(', ') || 'Failed to save contact'));
  }
}

async function toggleFav(id) {
  await fetch(`${API}/${id}/favorite`, { method: 'PATCH' });
  loadContacts();
}

async function deleteContact(id, name) {
  if (!confirm(`Are you sure you want to delete contact '${name}'?`)) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.success) {
    loadContacts();
  } else {
    alert(data.message);
  }
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

document.addEventListener('DOMContentLoaded', loadContacts);
