const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const { validateContact } = require('../middleware/validator');

// GET /api/contacts - List & search contacts (?search=, ?category=, ?is_favorite=, ?page=, ?limit=)
router.get('/', ContactController.getAllContacts);

// GET /api/contacts/:id - Get contact details by ID
router.get('/:id', ContactController.getContactById);

// POST /api/contacts - Add new contact
router.post('/', validateContact, ContactController.createContact);

// PUT /api/contacts/:id - Update contact by ID
router.put('/:id', ContactController.updateContact);

// PATCH /api/contacts/:id/favorite - Toggle favorite status
router.patch('/:id/favorite', ContactController.toggleFavorite);

// DELETE /api/contacts/:id - Delete contact by ID
router.delete('/:id', ContactController.deleteContact);

module.exports = router;
