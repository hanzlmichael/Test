const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes')
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config()
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express()
const PORT = process.env.PORT || 3210;

// view engine 
app.set('view engine', 'ejs')

// middleware
app.use(express.static('public'));
app.use(express.json({ limit: '10mb'}));
app.use(cookieParser());
app.use(cors());
/* const dbURI = process.env.DB_CONNECT;

mongoose.connect(dbURI)
  .then(() => app.listen(3210))
  .catch((err) => console.log(err))

 */
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECT);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
})


app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));
//app.get('/tests', requireAuth, (req, res) => res.render('tests', {tests}));
app.use('/tests', testRoutes);
app.use(authRoutes);
//app.use(testRoutes)