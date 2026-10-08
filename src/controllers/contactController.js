const ContactModel = require('../models/contactModel');
const { ApiError } = require('../middleware/errorHandler');

const ContactController = {
  getAllContacts(req, res, next) {
    try {
      const { search, category, is_favorite, sortBy, order, page, limit } = req.query;
      const result = ContactModel.findAll({ search, category, is_favorite, sortBy, order, page, limit });

      res.status(200).json({
        success: true,
        message: 'Contacts retrieved successfully',
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        },
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  },

  getContactById(req, res, next) {
    try {
      const contactId = parseInt(req.params.id, 10);
      if (isNaN(contactId)) {
        throw new ApiError(400, 'Invalid contact ID');
      }

      const contact = ContactModel.findById(contactId);
      if (!contact) {
        throw new ApiError(404, `Contact with ID ${contactId} not found`);
      }

      res.status(200).json({
        success: true,
        data: contact
      });
    } catch (error) {
      next(error);
    }
  },

  createContact(req, res, next) {
    try {
      const { email, phone } = req.body;

      if (ContactModel.findByEmail(email.trim().toLowerCase())) {
        throw new ApiError(409, `A contact with email '${email}' already exists`);
      }

      if (ContactModel.findByPhone(phone.trim())) {
        throw new ApiError(409, `A contact with phone '${phone}' already exists`);
      }

      const newContact = ContactModel.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        data: newContact
      });
    } catch (error) {
      next(error);
    }
  },

  updateContact(req, res, next) {
    try {
      const contactId = parseInt(req.params.id, 10);
      if (isNaN(contactId)) {
        throw new ApiError(400, 'Invalid contact ID');
      }

      const existing = ContactModel.findById(contactId);
      if (!existing) {
        throw new ApiError(404, `Contact with ID ${contactId} not found`);
      }

      const { email, phone } = req.body;

      if (email && email.trim().toLowerCase() !== existing.email) {
        const dupEmail = ContactModel.findByEmail(email.trim().toLowerCase());
        if (dupEmail && dupEmail.id !== contactId) {
          throw new ApiError(409, `A contact with email '${email}' already exists`);
        }
      }

      if (phone && phone.trim() !== existing.phone) {
        const dupPhone = ContactModel.findByPhone(phone.trim());
        if (dupPhone && dupPhone.id !== contactId) {
          throw new ApiError(409, `A contact with phone '${phone}' already exists`);
        }
      }

      const updated = ContactModel.update(contactId, req.body);

      res.status(200).json({
        success: true,
        message: 'Contact updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  deleteContact(req, res, next) {
    try {
      const contactId = parseInt(req.params.id, 10);
      if (isNaN(contactId)) {
        throw new ApiError(400, 'Invalid contact ID');
      }

      const existing = ContactModel.findById(contactId);
      if (!existing) {
        throw new ApiError(404, `Contact with ID ${contactId} not found`);
      }

      ContactModel.delete(contactId);

      res.status(200).json({
        success: true,
        message: `Contact '${existing.name}' (ID: ${contactId}) deleted successfully`
      });
    } catch (error) {
      next(error);
    }
  },

  toggleFavorite(req, res, next) {
    try {
      const contactId = parseInt(req.params.id, 10);
      if (isNaN(contactId)) {
        throw new ApiError(400, 'Invalid contact ID');
      }

      const updated = ContactModel.toggleFavorite(contactId);
      if (!updated) {
        throw new ApiError(404, `Contact with ID ${contactId} not found`);
      }

      res.status(200).json({
        success: true,
        message: updated.is_favorite ? 'Contact marked as favorite' : 'Contact removed from favorites',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ContactController;
