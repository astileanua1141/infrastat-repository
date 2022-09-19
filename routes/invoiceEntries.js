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
  console.log("/new - get creates an instance of ie. ")
  res.render('invoiceEntries/new', { invoiceEntry: new InvoiceEntry() });
});

// Create Invoice Entry
router.post("/:invoiceId", async (req, res) => {
  console.log("POST invoiceEntries /:invoiceId")  

  const invoiceEntry = new InvoiceEntry({
    nc8Code: req.body.nc8Code,
    invoiceValue: req.body.invoiceValue,
    statisticalValue: req.body.statisticalValue,
    netMass: req.body.netMass
  })
 

  if(req.params.invoiceId){
  try {
    const newInvoiceEntry = await invoiceEntry.save()
    console.log("SAVED new entry: " + newInvoiceEntry.id)
    //invoiceNo: req.params.invoiceNo
    console.log("Updating invoice with ID " + req.params.invoiceId)

    const invoiceId = req.params.invoiceId
    const invoice = await Invoice.findById(invoiceId)
    const newEntries = [...invoice.entries, newInvoiceEntry.id ] 
    console.log("new entries:" + newEntries )
    invoice.entries = newEntries
    invoice.save()

    res.redirect(`/invoiceEntries/${newInvoiceEntry.id}`)
  } catch {
    console.log(invoiceEntry)
    console.log(invoice)
    res.render('invoiceEntries/new', {
      invoiceEntry: invoiceEntry,
      errorMessage: "Error Creating Invoice Entry"
    })
  }
}else { 
  console.log(invoiceEntry)
  console.log ("No invoiceId referenced")
    res.render('invoiceEntries/new', {
      invoiceEntry: invoiceEntry,
      errorMessage: "Error Creating new Article - the reference invoice is missing."
    })

}
});


//show by id 
router.get('/:id', async (req, res) => {
  console.log ("GET invoiceEntries /:id (invoiceEntryId)")
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
router.put('/:id/:invoiceNo', async (req, res) => {
  let invoiceEntry 
  try {
    invoiceEntry = await InvoiceEntry.findById(req.params.id)
     //do not allow edit
    invoiceEntry.nc8Code = req.body.nc8Code,
    invoiceEntry.invoiceValue = req.body.invoiceValue,
    invoiceEntry.statisticalValue = req.body.statisticalValue,
    invoiceEntry.netMass = req.body.netMass
    await invoiceEntry.save()

    const invoiceNo = req.params.invoiceNo
    const invoice = await Invoice.findById(invoiceNo)
    const newEntries = [...invoice.entries, invoiceEntry.id ] 
    invoice.entries = newEntries
    invoice.save()

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
  console.log("Deleting")
  try {
    invoiceEntry = await InvoiceEntry.findById(req.params.id)
    console.log('Entry: ' + invoiceEntry)
    

    const invoice = await Invoice.find({ entries: invoiceEntry.id })
    console.log('Entries: ' + invoice.entries.length)

    // await invoiceEntry.delete()
    if(invoice) { 
      if( invoice.entries.length == 1) {
      console.log("deleteing invoice")
      }else{
        
        const { id : { invoice :{ entries : id }}, ...rest} = invoice.entries
        console.log("rest"+rest)

      }
    }
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
