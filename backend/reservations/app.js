const express = require("express");
const app = express();
const fs = require('fs');

let reservationsData = fs.readFileSync('./models/reservations.json');
let mongoClient = require('mongodb').MongoClient;
let db = undefined;
let url = "mongodb://backend_mongodb_service_1:27017/idpdb";
/*
let url = "mongodb://localhost:27017/idpdb";
*/

let RESERVATIONS_COLLECTION = "reservations";

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

mongoClient.connect(url, function(err, client) {
    if (err) {
        console.log('database is not connected');
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

                if (collectionNames.indexOf(RESERVATIONS_COLLECTION) < 0) {
                    db.createCollection(RESERVATIONS_COLLECTION, function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("Reservations collection has been successfully created!");

                            let reservations = JSON.parse(reservationsData);
                            db.collection(RESERVATIONS_COLLECTION).insertMany(reservations, function(err, res) {
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

app.get("/", (req, res) => res.send(`reservations service is working`));

app.post("/reservation", function(req, res){
    let response = req.body;
    db.collection(RESERVATIONS_COLLECTION).insertOne(response, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(null);
        }
        console.log("1 document inserted");
    });
    res.end(JSON.stringify(response));
});

app.get('/reservations', function (req, res) {
    db.collection(RESERVATIONS_COLLECTION).find({}).toArray(function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(null);
        }
        res.status(200).send(result);
    })
});

app.listen(3001, () => {
    console.log(`Reservations service listening on port 3001`);
});