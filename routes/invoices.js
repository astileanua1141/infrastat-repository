const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice.js')
const InvoiceEntry = require('../models/invoiceEntry.js')
const NatureOfTransaction = require('../models/natureOfTransaction.js')

// All invoices
router.get("/", async (req, res) => {
  const searchOptions = {}
  let invoices
  if (req.query.searchValue  != null && req.query.searchValue != ''
  && req.query.searchField  != null && req.query.searchField != '') {
      searchOptions.searchField = req.query.searchField
      searchOptions.searchValue = req.query.searchValue
      
      if (searchOptions.searchField === 'nc8code') {
        const regex = new RegExp(req.query.invoiceNo, 'i')
        invoices = await Invoice.aggregate([
          { $match:{}},
          { $unwind: '$entries'},
          { $match : { 'entries.nc8code' : {$regex : regex } } }
        ])
        
      } else {
        invoices = await Invoice.find()
          .where(`${req.query.searchField}`) 
          .equals(req.query.searchValue)
      }
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
  const invoiceEntryIds = await InvoiceEntry.find({ invoiceNo : req.body.invoiceNo}, '_id')
  const invoice = new Invoice({
    firmName : req.body.firmName,
    timeline : req.body.timeline,
    invoiceNo : req.body.invoiceNo,
    totalVal : req.body.totalVal,
    exchangeRate : req.body.exchangeRate,
    currency : req.body.currency,
    deliveryTermsCode : req.body.deliveryTermsCode,
    natureOfTransactionCodeA : req.body.natureOfTransactionCodeA,
    natureOfTransactionCodeB : req.body.natureOfTransactionCodeB,
    entries : invoiceEntryIds
  })   
  try {
    const newInvoice = await invoice.save()
    // TODO:
    // res.redirect(`invoices/${newInvoice.id}`)
    res.redirect('/invoices')
    
  } catch (error) {
    console.log(error.errorMessage)
    res.render('invoiceEntries/new', {
      invoice: invoice,
      errorMessage: "Error Creating Invoice Entry" 
    })
  }

});

//show by id 
router.get('/:id', async (req, res) => {
  try {
    const natureOfTransactions = await NatureOfTransaction.find({})
    const invoice = await Invoice.findById(req.params.id).populate('entries').exec()
    //console.log(invoice)
    res.render('invoices/show', {
      invoice : invoice,
      natureOfTransactions :natureOfTransactions })

  } catch {
    res.redirect('/')
  }
})

//edit
router.get('/:id/edit', async (req, res) => {
  res.send("Edit invoice "+req.params.id)
})

//delete
router.delete('/:id/', async (req, res) => {
  res.send("delete invoice "+req.params.id)
})


module.exports = router