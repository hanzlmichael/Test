const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Test = require('../models/Test');
const mongoose = require('mongoose');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  res.locals.author = true;
  //res.locals.author = null;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const checkAuthor = async (req, res, next) => {
  console.log('dostal se sem')
  let testId = req.url.substring(1, req.url.length)

  // check if user has a valid token
  console.log('dostal se sem1')
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.author = null;
        next();
      } else {
        let user, teacherRef;
        
        // use Promise.all() to wait for both queries to complete
        await Promise.all([
          User.findById(decodedToken.id).select("_id").exec(),
          Test.findById(testId).select("teacherRef").exec()
        ])
          .then(([userDoc, testDoc]) => {
            user = userDoc._id.toString();
            teacherRef = testDoc.teacherRef.toString();
          })
          .catch((err) => {
            
            console.log(err);
          });

        if (user == teacherRef) {
          console.log('--------------------------------', user)

          res.locals.author = user;
        } else {
          res.locals.author = null;
        }

        next();
      }
    });
  } else {
    res.locals.author = null;
    next();
  }
}

module.exports = { requireAuth, checkUser, checkAuthor };