const express = require("express");
const app = express();
const fs = require('fs');

let restaurantsData = fs.readFileSync('./models/restaurants.json');
let mongoClient = require('mongodb').MongoClient;
let url = "mongodb://backend_mongodb_service_1:27017/idpdb";
/*
let url = "mongodb://localhost:27017/idpdb";
*/

let RESTAURANTS_COLLECTION = "restaurants";
let db = undefined;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

mongoClient.connect(url, function(err, client) {
    if (err) {
        console.log('database is not connected');
        console.log(err);
    }
    else {
        console.log('database is connected!!');
        db = client.db("idpdb");

        db.collections(function(err, cols) {
            if (err) {
                throw err;
            } else {
                let collectionNames = [];
                cols.forEach(function(col) {
                    collectionNames.push(col.collectionName);
                });

                if (collectionNames.indexOf(RESTAURANTS_COLLECTION) < 0) {
                    db.createCollection(RESTAURANTS_COLLECTION, function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("Restaurant collection has been successfully created!");

                            let restaurants = JSON.parse(restaurantsData);
                            db.collection(RESTAURANTS_COLLECTION).insertMany(restaurants, function(err, res) {
                                if (err) {
                                    console.log("json elements couldn't be added");
                                } else {
                                    console.log("json data was added to collection");
                                }
                            });
                        }
                    })
                }
            }
        })
    }
});

app.get("/", (req, res) => res.send(`restaurants service is working`));

app.post("/restaurant", function(req, res){
    let response = req.body;
    db.collection(RESTAURANTS_COLLECTION).insertOne(response, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(null);
        }
        console.log("1 document inserted");
    });
    res.end(JSON.stringify(response));
});

app.get('/restaurants', function (req, res) {
   db.collection(RESTAURANTS_COLLECTION).find({}).toArray(function(err, result) {
       if (err) {
           console.error(err);
           res.status(500).send(null);
       }
       res.status(200).send(result);
   })
});


app.post("/restaurant-delete", function(req, res){
    let response = req.body;
    console.log(response);
    let query = {id: req.body.id};
    db.collection(RESTAURANTS_COLLECTION).deleteOne(query, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(null);
        }
        console.log("1 document deleted");
    });
    //convert the response in JSON format
    res.end(JSON.stringify(response));
});

app.post("/restaurant-modify", function(req, res){
    let response = req.body;
    console.log(response);
    let query = {id: req.body.id};
    let newValue = {$set: {numberOfTables: req.body.numberOfTables}};
    db.collection(RESTAURANTS_COLLECTION).updateOne(query, newValue, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(null);
        }
        console.log("1 document updated");
    });
    //convert the response in JSON format
    res.end(JSON.stringify(response));
});



app.listen(3002, () => {
    console.log(`Restaurants service listening on port 3002`);
});
