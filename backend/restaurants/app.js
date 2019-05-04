const express = require("express");
const app = express();
const fs = require('fs');

let restaurantsData = fs.readFileSync('./models/restaurants.json');
let mongoClient = require('mongodb').MongoClient;
let url = "mongodb://backend_mongodb_service_1:27017/idpdb";
let RESTAURANTS_COLLECTION = "restaurants";

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

mongoClient.connect(url, function(err, client) {
    if (err) {
        console.log('database is not connected');
    }
    else {
        console.log('database is connected!!');
        let db = client.db("idpdb");

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

app.listen(3002, () => {
    console.log(`Restaurants service listening on port 3002`);
});
