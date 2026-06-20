require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes');
require('./connections');

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Leave Management server running at port ${PORT}`);
});
