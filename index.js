const express = require("express");
const LoginRoute = require("./api/routes/LoginRoute");
const weightRoute = require("./api/routes/weightRoute");
const {createTableIfNotExists: createUserTableIfNotExists} = require("./data/UserSQL");
const {createTableIfNotExists: createVehicalTableIfNotExists} = require("./data/weightSQL");

createUserTableIfNotExists();
createVehicalTableIfNotExists();
require("dotenv").config();

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());


app.use("/", LoginRoute);
app.use("/", weightRoute);

app.listen(3001, () => console.log("Server started"));

module.exports = app;
