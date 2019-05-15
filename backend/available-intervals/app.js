const express = require("express");
const app = express();
const fs = require('fs');

let availablePositionsData = fs.readFileSync('./models/availablePositions.json');
let mongoClient = require('mongodb').MongoClient;
/*
let url = "mongodb://backend_mongodb_service_1:27017/idpdb";
*/
let url = "mongodb://localhost:27017/idpdb";
let db = undefined;
let AVAILABLE_POSITIONS_COLLECTION = "availablePositions";

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
        throw err;
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

                if (collectionNames.indexOf(AVAILABLE_POSITIONS_COLLECTION) < 0) {
                    db.createCollection(AVAILABLE_POSITIONS_COLLECTION, function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("AvailablePositions collection has been successfully created!");

                            let availablePositions = JSON.parse(availablePositionsData);
                            db.collection(AVAILABLE_POSITIONS_COLLECTION).insertMany(availablePositions, function(err, res) {
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

app.get("/", (req, res) => res.send(`Available intervals service is working`));

app.post("/interval", function(req, res){
    let response = req.body;
    db.collection(AVAILABLE_POSITIONS_COLLECTION).insertOne(response, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(null);
        }
        console.log("1 interval inserted");
    });
    res.end(JSON.stringify(response));
});

app.get('/intervals', function (req, res) {
    db.collection(AVAILABLE_POSITIONS_COLLECTION).find({}).toArray(function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(null);
        }
        res.status(200).send(result);
    })
});

app.listen(3000, () => {
    console.log(`Available intervals service listening on port 3000`);
});