const Test = require("../models/Test");
const mongoose = require('mongoose');

module.exports.getResultById = async (req, res) => {
  console.log('yy')
  let testId = req.params.testId;
  console.log('here')
  try {
    const test = await Test.findById(testId);
    if (test) {
      console.log('foundTest: ', testId)
      console.log(test)
      res.render('new', { test });
    }
  }
  catch(err) {
    console.log(err)
  }
}

module.exports.postResult = async (req, res) => {
  
  console.log('yy')
  let testId = req.params.testId;
  console.log('here')
  try {
    const test = await Test.findById(testId);
    if (test) {
      console.log('foundTest: ', testId)
      console.log(test)
      res.render('new', { test });
    }
  }
  catch(err) {
    console.log(err)
  }
}