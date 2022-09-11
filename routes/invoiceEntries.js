const express = require('express');
const router = express.Router();
const InvoiceEntry = require('../models/invoiceEntry.js')

// All invoice entries
router.get("/", async (req, res) => {
  let searchOptions = {}
  if (req.query.  != null && req.query.invoiceNo !== '') {
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
    // res.redirect(`invoiceEntries/${newInvoiceEntry.id}`)
      res.redirect(`invoiceEntries`)
  } catch {
    res.render('invoiceEntries/new', {
      invoiceEntry: invoiceEntry,
      errorMessage: "Error Creating Invoice Entry"
    })
  }
});

module.exports = router;
