const express = require('express');
const router = express.Router();
const InvoiceEntry = require('../models/invoiceEntry.js')
const Invoice = require('../models/invoice.js')

// All invoice entries
router.get("/", async (req, res) => {
  let searchOptions = {}
  if (req.query.invoiceNo  !== null && req.query.invoiceNo !== '') {
    searchOptions.invoiceNo = new RegExp(req.query.invoiceNo, 'i')
  }
  try {
    const invoiceEntries = await InvoiceEntry.find(searchOptions)
    res.render('invoiceEntries/index', {
       invoiceEntries: invoiceEntries,
       searchOptions : req.query      
      });
  } catch {
    res.redirect('/')
  }
});

// New Invoice Entry
router.get("/new", (req, res) => {
  res.render('invoiceEntries/new', { invoiceEntry: new InvoiceEntry() });
});

// Create Invoice Entry
router.post("/", async (req, res) => {
  const invoiceEntry = new InvoiceEntry({
    invoiceNo: req.body.invoiceNo,
    nc8Code: req.body.nc8Code,
    invoiceValue: req.body.invoiceValue,
    statisticalValue: req.body.statisticalValue,
    netMass: req.body.netMass
  })

  try {
    const newInvoiceEntry = await invoiceEntry.save()
    res.redirect(`invoiceEntries/${newInvoiceEntry.id}`)
  } catch {
    console.log(invoiceEntry)
    res.render('invoiceEntries/new', {
      invoiceEntry: invoiceEntry,
      errorMessage: "Error Creating Invoice Entry"
    })
  }
});

//show by id 
router.get('/:id', async (req, res) => {
  try {
    const invoiceEntry = await InvoiceEntry.findById(req.params.id)
    const invoices = await Invoice.find ( { entries : invoiceEntry.id}).limit(10).exec()
    res.render('invoiceEntries/show', {
      invoiceEntry : invoiceEntry,
      invoices : invoices
    })

  } catch {
    res.redirect('/')
  }
})

// edit
router.get('/:id/edit', async (req, res) => {
  try {
    const invoiceEntry = await InvoiceEntry.findById(req.params.id)
    res.render('invoiceEntries/edit', { invoiceEntry : invoiceEntry })
  } catch  {
    res.redirect('/invoiceEntries')
  }
})

//modify
router.put('/:id', async (req, res) => { 
  let invoiceEntry 
  try {
    invoiceEntry = await InvoiceEntry.findById(req.params.id)
    invoiceEntry.invoiceNo = req.body.invoiceNo,
    invoiceEntry.nc8Code = req.body.nc8Code,
    invoiceEntry.invoiceValue = req.body.invoiceValue,
    invoiceEntry.statisticalValue = req.body.statisticalValue,
    invoiceEntry.netMass = req.body.netMass
    await invoiceEntry.save()
    res.redirect(`/invoiceEntries/${invoiceEntry.id}`)
  } catch {
    if (invoiceEntry == null ) {
      res.redirect('/')
    } else {
      res.render('invoiceEntries/edit', {
        invoiceEntry: invoiceEntry,
        errorMessage: "Error updating Invoice Entry"
      })
    }
  }
})

//delete
router.delete('/:id', async (req, res) => { 
  let invoiceEntry 
  try {
    invoiceEntry = await InvoiceEntry.findById(req.params.id)
    
    await invoiceEntry.remove()
    res.render('invoiceEntries/')
    
  } catch {
    if (invoiceEntry == null ) {
      res.redirect('/')
    } else {
      res.redirect(`/invoiceEntries/${invoiceEntry.id}`)
      
    }
  }
})

module.exports = router;
