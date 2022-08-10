require('dotenv').config();
const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const cookie = require("cookie-parser");
const bcrypt = require('bcrypt');
const port = parseInt(process.env.PORT) || 4000;
app.use(router, express.json, cookie(), express.urlencoded({
    extended: true
}));

app.use("/", require("./config/pages.js"))
app.use("/api" , require("./controllers/auth"));

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})



app.post('/index.js')

app.listen(port, ()=> {
    console.log(`Server is running at port ${port}`);
});

