const db = require('../config/database');

const ContactModel = {
  findAll({ search, category, is_favorite, sortBy = 'id', order = 'DESC', page = 1, limit = 10 }) {
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category.toLowerCase());
    }

    if (is_favorite !== undefined && is_favorite !== '') {
      conditions.push('is_favorite = ?');
      params.push(is_favorite === 'true' || is_favorite === '1' || is_favorite === 1 ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
    const totalRow = db.prepare(countSql).get(...params);
    const total = totalRow ? totalRow.total : 0;

    const allowedSortCols = ['id', 'name', 'company', 'category', 'is_favorite', 'created_at'];
    const safeSortCol = allowedSortCols.includes(sortBy) ? sortBy : 'id';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (safePage - 1) * safeLimit;

    const dataSql = `
      SELECT * FROM contacts
      ${whereClause}
      ORDER BY ${safeSortCol} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const contacts = db.prepare(dataSql).all(...params, safeLimit, offset);

    return {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      data: contacts
    };
  },

  findById(id) {
    return db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
  },

  findByEmail(email) {
    return db.prepare('SELECT * FROM contacts WHERE email = ?').get(email);
  },

  findByPhone(phone) {
    return db.prepare('SELECT * FROM contacts WHERE phone = ?').get(phone);
  },

  create({ name, email, phone, company, job_title, address, category = 'personal', is_favorite = 0 }) {
    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, phone, company, job_title, address, category, is_favorite)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const fav = is_favorite ? 1 : 0;
    const result = stmt.run(
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      company ? company.trim() : null,
      job_title ? job_title.trim() : null,
      address ? address.trim() : null,
      category.toLowerCase(),
      fav
    );

    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated = {
      name: data.name !== undefined ? data.name.trim() : existing.name,
      email: data.email !== undefined ? data.email.trim().toLowerCase() : existing.email,
      phone: data.phone !== undefined ? data.phone.trim() : existing.phone,
      company: data.company !== undefined ? (data.company ? data.company.trim() : null) : existing.company,
      job_title: data.job_title !== undefined ? (data.job_title ? data.job_title.trim() : null) : existing.job_title,
      address: data.address !== undefined ? (data.address ? data.address.trim() : null) : existing.address,
      category: data.category !== undefined ? data.category.toLowerCase() : existing.category,
      is_favorite: data.is_favorite !== undefined ? (data.is_favorite ? 1 : 0) : existing.is_favorite
    };

    const stmt = db.prepare(`
      UPDATE contacts
      SET name = ?, email = ?, phone = ?, company = ?, job_title = ?, address = ?, category = ?, is_favorite = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      updated.name,
      updated.email,
      updated.phone,
      updated.company,
      updated.job_title,
      updated.address,
      updated.category,
      updated.is_favorite,
      id
    );

    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  toggleFavorite(id) {
    const existing = this.findById(id);
    if (!existing) return null;

    const newFav = existing.is_favorite ? 0 : 1;
    db.prepare('UPDATE contacts SET is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newFav, id);
    return this.findById(id);
  }
};

module.exports = ContactModel;
