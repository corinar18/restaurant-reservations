const express = require("express");
const app = express();

app.get("/", (req, res) => res.send(`reservations service is working`));

app.listen(3002, () => {
    console.log(`Reservations service listening on port 3001`);
});