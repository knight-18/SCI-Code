const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(()=>{
    console.log("Connected to Mongo DB");
}).catch(err=>{
    console.error(err);
})
app.set('view engine','html');
// app.set('view engine', 'html');
const publicDir = path.join(__dirname + '/public');
console.log(publicDir);
app.use(express.static(publicDir));


const UserRoutes = require("./src/routers/user.js");

app.use('/siccodeapi',UserRoutes);


app.listen(PORT,()=>{
    console.log(`Server Up and Running on Port ${PORT}`);
})
// const dataArray = require("./test")
// const Scidata = require("./src/models/Sicdata")
// const fun = async()=>{
//     try {
//         await Scidata.insertMany(dataArray);
//         console.log("Sexesful");
//     } catch (error) {
//         console.log(error);
//     }

// }

// fun()
// const {Digit2CodeQuery, Digit3CodeQuery, Digit4CodeQuery} = require("./src/utils/query")
// const query = async()=>{
//     try {
//         // console.log(await Digit2CodeQuery("01", "trialToken"))
//         console.log(await Digit3CodeQuery("011", "premiumToken"));
//     } catch (error) {
//         console.log(error);
//     }
// }
// query()