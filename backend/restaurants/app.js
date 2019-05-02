const express = require("express");
const app = express();

let mongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/mydb";

mongoClient.connect(url, function(err, db) {
    if(err) {
        console.log('database is not connected')
    }
    else {
        console.log('connected!!')
    }
});

app.get("/", (req, res) => res.send(`restaurants service is working`));

app.listen(3002, () => {
    console.log(`Restaurants service listening on port 3002`);
});