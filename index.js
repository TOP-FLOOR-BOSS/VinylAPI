require('dotenv').config();
const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const port = parseInt(process.env.PORT) || 4000;
app.use(router, express.json, express.urlencoded({
    extended: true
}));
app.listen(port, ()=> {
    console.log(`Server is running at port ${port}`);
});

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})