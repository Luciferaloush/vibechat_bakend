const express = require('express');
require('dotenv').config();
const { json } = require('body-parser');
const cors = require('cors');
const app = express();

app.use(json());
app.use(cors());



app.use('/chat/v1/api/aut', require('./src/routes/auth.router'));

app.get('/', (req, res) => {
    console.log('test');
    res.send("yes it works");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});