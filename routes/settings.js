const express = require("express");
const router = express.Router();
const NatureOfTransaction = require('../models/natureOfTransaction.js')



// All settngs entries
router.get("/", async (req, res) => {
    
    try {
      const transactionCodes = await NatureOfTransaction.find({})
      res.render('settings/index', {
        natureOfTransaction: transactionCodes
        });
    } catch {
      res.redirect('/')
    }
  });

  router.get("/new", (req, res) => {
    res.render('settings/new', { transactionCode: new NatureOfTransaction() });
  });
  
  // Create NatureOfTransaction Code Entry
router.post("/", async (req, res) => {
  const natureOfTransaction = new NatureOfTransaction({
    code: req.body.code,
    name: req.body.name,
    refCode: req.body.refCode,
    category: req.body.category
  })

  try {
    const newNatureOfTransaction = await natureOfTransaction.save()
    // res.redirect(`invoiceEntries/${newInvoiceEntry.id}`)
      res.redirect(`settings`)
  } catch {
    res.render('settings/new', {
        transactionCode: natureOfTransaction,
      errorMessage: "Error Creating natureOfTransaction entry"
    })
  }
});


  module.exports = router;