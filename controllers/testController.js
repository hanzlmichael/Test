const Test = require("../models/Test");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports.getTests = async (req, res) => {

  let token = req.cookies.jwt;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      console.log(err);
    } else {
      let teacherRef = decodedToken.id;
      console.log('teacherRef ', teacherRef)
      let tests = await Test.find({ teacherRef: mongoose.Types.ObjectId(`${teacherRef}`)}).sort({ createdAt: -1});
      res.render('dashboard', { tests })
    }
  });

}

module.exports.postTest = async (req, res) => {
  const { title, categories, test } = req.body;

  const token = req.cookies.jwt;
  let teacherRef;

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      // Handle token verification error
      res.sendStatus(403);
    } else {
      let teacherRef = decodedToken.id;
      try {
        const createdTest = await Test.create({ teacherRef, title, categories, test})
        if (createdTest) {
          console.log('createdTest: ', createdTest)
          res.redirect('/tests');
        }
      }
      catch (err) {
        console.log(err);
      }
    }
  });  
}

module.exports.deleteTest = async (req, res) => {
  let testId = req.params.testId;
  console.log('testId', testId)

  try {
    const test = await Test.findByIdAndRemove(testId);
    if (test) {
      console.log('deletedTest: ', testId)
      res.redirect('/tests');
    }
  }
  catch(err) {
    console.log(err)
  }
}

module.exports.getNewTest = (req, res) => {
  let test = false;

  res.render('new', { test })
}

module.exports.getTestById = async (req, res) => {
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

module.exports.updateTestById = async (req, res) => {
  console.log('UPDATE TEST BACKEND')
  const { title, categories, test } = req.body;
  const testId = req.params.testId;
  
  console.log('testId', testId)
  console.log('testtitle: ', title)
  
  const token = req.cookies.jwt;
  let teacherRef;

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      console.log('err1')
      // Handle token verification error
      res.sendStatus(403);
    } else {
      console.log('err2')
      let teacherRef = decodedToken.id;
      try {
        console.log('err3')
        console.log('testId', testId)
        const updatedTest = await Test.findByIdAndUpdate(testId, {title, categories, test }, {
          new: true, // returns the updated test instead of the original one
          runValidators: true, // validates the updated test against the schema
        });
        console.log('err4')
        if (updatedTest) {
          console.log('err5')
          console.log('updatedTest: ', updatedTest)
          res.redirect('/tests');
        }
      }
      catch (err) {
        console.log('err6')
        console.log(err);
      }
    }
  });  
}