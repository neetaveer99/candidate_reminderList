require("dotenv").config();
const express = require("express");
const app = express();

require("./db/conn");

const cors = require("cors");

const router = require("./Routes/router");



const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, ()=>{
    console.log(`server starts at port ${PORT}`);
})