const express = require("express");
const app = express();

app.get("/", (req, res) => res.send(`available-intervals service is working`));

app.listen(3001, () => {
    console.log(`Available intervals service listening on port 3001`);
});