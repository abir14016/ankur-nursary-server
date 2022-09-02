const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome from ankur nursary');
})

app.listen(port, () => {
    console.log(`Ankur Nursary listening on port ${port}`);
})