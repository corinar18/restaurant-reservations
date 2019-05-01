const express = require("express");
const app = express();

app.get("/", (req, res) => res.send(`restaurants service is working`));

app.listen(3000, () => {
    console.log(`Restaurants service listening on port 3000`);
});