const express = require('express');
const router = express.Router();
const loanPaymentController = require('../controllers/loanPaymentController');

// --- Loan Payment Routes ---

// GET /api/v1/loans/payments - Get all payments for a specific loan (requires loanId query param)
// Front-end: apiCaller('/loans/payments?loanId=123', null, 'GET')
router.get('/payments', loanPaymentController.getPaymentsByLoan); 

// POST /api/v1/loans/payments - Add a new payment to a loan
// Front-end: apiCaller('/loans/payments', { loanId: 123, paymentAmount: 100 }, 'POST')
router.post('/payments', loanPaymentController.addPayment);

// Note: You generally don't need update/delete for payments, as they represent a historical transaction. 
// If you did, they would typically target a specific payment ID:
// router.delete('/payments/:id', loanPaymentController.deletePayment); 

module.exports = router;