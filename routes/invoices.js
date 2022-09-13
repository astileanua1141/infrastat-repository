const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice.js')
const NatureOfTransaction = require('../models/natureOfTransaction.js')

// All invoice entries
router.get("/", async (req, res) => {
  const searchOptions = {}
  let invoices
  if (req.query.searchValue  !== null && req.query.searchValue !== ''
  && req.query.searchField  !== null && req.query.searchField !== '') {
      searchOptions.searchField = new RegExp(req.query.searchField, 'i')
      searchOptions.searchBy = req.query.searchValue
      searchOptions.searchValue = req.query.searchValue  
      
      invoices = await Invoice.find({
        [req.query.searchField] : new RegExp(req.query.searchField, 'i')
    });    
  } else {
    invoices = await Invoice.find(); 
  }

  res.render('invoices/index', {
    invoices : invoices,
    searchOptions : req.query,
    availableSearchTags : [
      {
        searchField : "invoiceNo",
        displayName : "Nr. Factura"
      },
      {
        searchField : "timeline",
        displayName : "Perioada declaratiei"
      },
      {
        searchField : "nc8code",
        displayName : "Cod incadrare"
      },
      {
        searchField : "partnerVatNr",
        displayName : "TVA Partener"
      },
      {
        searchField : "partnerVatNr",
        displayName : "TVA Partener"
      }]
  })
});

 // New Invoice 
 router.get("/new", async (req, res) => {
  try {
    const natureOfTransactions = await NatureOfTransaction.find({})
    console.log(natureOfTransactions)
    const invoice = new Invoice() 
    res.render('invoices/new', {
      natureOfTransactions : natureOfTransactions,
      invoice: invoice
    })

  } catch (error) {
    console.log(error)
    res.redirect('/invoices')

    
  }
});

// Create Invoice
router.post("/", async (req, res) => {
  res.send('Create Invoice')
});

module.exports = router