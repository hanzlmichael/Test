const ResultSchema = new mongoose.Schema({
  testRef: {
    type: mongoose.Schema.Types.ObjectId
  },
  firstName: {
    type: String,
    required: [true, 'Chybí křestní jméno']
  },
  lastName: {
    type: String,
    required: [true, 'Chybí příjmení']
  },
  email: {
    type: String,
    required: [true, 'Chybí email']
  },
  answers: [],
  points: Number,
  mark: Number
}, { timestamps: true });

const Result = mongoose.model('result', resultSchema);

module.exports = Result;