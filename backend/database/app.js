const express = require("express");
const app = express();

app.get("/", (req, res) => res.send(`database service is working`));

app.listen(3003, () => {
    console.log(`Database service listening on port 3001`);
});