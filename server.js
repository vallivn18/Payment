/*
//Payment.card_details
"cardNumber": "1234567812345678",
"cvv": "123",
"cardName": "Valli",
"cardType": "Visa",
"expMonth": 1,
"expYear": 28
*/

//npm install express mongoose body-parser
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Payment', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Mongoose schema for card_details and transactions
const cardDetailsSchema = new mongoose.Schema({
  cardNumber: Number,
  cardType: String, 
  cardName: String,
  expMonth: Number, 
  expYear: Number,
  cvv: Number
});

const transactionSchema = new mongoose.Schema({
  cardNumber: String,
  cardHolderName: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const CardDetails = mongoose.model('card_details', cardDetailsSchema);
const Transaction = mongoose.model('transactions', transactionSchema);

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/processPayment', async (req, res) => {
  const { card_type, card_name, card_number, exp_month, exp_year, cvv } = req.body;

  // Check if the card exists in the card_details table
  const existingCard = await CardDetails.findOne({
    cardType: card_type,
    cardName: card_name,
    //cardNumber: card_number,
    expMonth: exp_month,
    expYear: exp_year,
    cvv: cvv
  });

  if (existingCard) {
    // Store the transaction details in the transactions table
    const newTransaction = new Transaction({
      cardNumber: existingCard.cardNumber,
      cardHolderName: existingCard.cardName,
      amount: 13290
    });

    await newTransaction.save();

    res.send('Transaction successful');
  } else {
    res.send('Card details not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
