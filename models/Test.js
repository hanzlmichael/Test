const mongoose = require('mongoose');
/* 
const testSchema = new mongoose.Schema({
  teacherRef: {
    type: mongoose.Schema.Types.ObjectId
  },
  title: {
    type: String,
    required: [true, 'Chybí název testu']
  },
  marksBoundaries: [],
  questions: [],
  maps: [],
  isActive: Boolean,
  timeLimit: String,
  categories: []
}, { timestamps: true });

const Test = mongoose.model('test', testSchema);
 */


const testSchema = new mongoose.Schema({
  teacherRef: {
    type: mongoose.Schema.Types.ObjectId
  },
  title: {
    type: String,
    required: [true, 'Chybí název testu']
  },
  categories: [],
  maps: [],
  test: {}
}, { timestamps: true });

const Test = mongoose.model('test', testSchema);


module.exports = Test