const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// --- Loan CRUD Routes ---

// GET /api/v1/loans - Get all loans for a specific user (requires userId query param)
// Front-end: apiCaller('/loans?userId=1', null, 'GET')
router.get('/', loanController.getLoans); 

// POST /api/v1/loans - Create a new loan
// Front-end: apiCaller('/loans', { ...loanData, userId: 1 }, 'POST')
router.post('/', loanController.createLoan);

// PUT /api/v1/loans - Update an existing loan
// Note: We use PUT/PATCH on the collection path here, as your controller expects the 'id' in the body.
// (A more standard REST approach would be PUT/PATCH /loans/:id)
// Front-end: apiCaller('/loans', { id: 123, newAmount: 5000 }, 'PUT')
router.put('/', loanController.updateLoan);

// DELETE /api/v1/loans - Delete a loan
// Note: We use DELETE on the collection path here, as your controller expects the 'id' in the body.
// (A more standard REST approach would be DELETE /loans/:id)
// Front-end: apiCaller('/loans', { id: 123 }, 'DELETE')
router.delete('/', loanController.deleteLoan);

module.exports = router;