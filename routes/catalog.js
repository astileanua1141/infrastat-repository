const express = require("express");
const nomenclator = require("../models/nomenclatura")
const router = express.Router();

const Nomenclator = require("../models/nomenclatura");

// Getting all
router.get("/", async (req, res) => {
  try {
    const catalog = await Nomenclator.find();
    res.json(catalog)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getArticleById, async (req, res) => {
  res.send(res.article);
});


// Get articles matching partial text
router.post("/", getArticleByText, populateChildren, async (req, res) => {
  res.json(res.articles);
});

async function populateChildren(req, res, next) {
  let articles

    articles = res.articles
    for (var element of articles){
      try {
        let children
        children = await Nomenclator.getChildren(element._id);
        //console.log('element  ' + element._id + ' has ' + children.length + ' children.');
        element.children = children
      }
      catch (err) {
        console.log('element error  ' + err.message);
      }
    }
    res.articles = articles
  
  next()
}

async function getArticleByText(req, res, next) {
  let articles

  try {
    if (req.body.text != null) {
      articles = await Nomenclator.findSimilarText(req.body.text);

      if (articles == null) {
        return res.status(404).json({ message: 'Cannot find any match' })
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.articles = articles
  next()
}





//a middleware: next will allow us to move to the next callback in our methods
async function getArticleById(req, res, next) {
  let article
  try {
    article = await Nomenclator.findById(req.params.id)
    if (article == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.article = article
  next()
}


module.exports = router;