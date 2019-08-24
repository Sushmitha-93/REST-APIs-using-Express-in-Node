const logger = require("./middleware/loggerMiddleware");
const express = require("express");
const morgan = require("morgan");
const config = require("config");
const startUpDebugger = require("debug")("app:startUp"); // set DEBUG=app:startUp, app:db or (db:*)
const dbDugger = require("debug")("app:db");
// APIs
const courses = require("./routes/courses");
const home = require("./routes/home");

// Creates server which can listen to a port specified
const app = express(); //returns an express object which has many functions

// 2 ways to find ENVIRONMENT of the application:
startUpDebugger(`NODE_ENV : ${process.env.NODE_ENV}`);
startUpDebugger(`app: ${app.get("env")}`);

// For example if there was DB work..
dbDugger("DB connected..");

// CONFIGURATION for environment using config package:
console.log(`App name: ${config.get("name")}`);
console.log(`Mail Server: ${config.get("mail.server")}`);
console.log(`Mail Server Password: ${config.get("mail.password")}`); //password saved in custom env variable is mapped to mail config in "custom-environment-variables.json file"

// ------------------------------------------Middlewares-----------------------------------------
//Below 3 are Built-in Express middlewares: json(), urlencoded(), static()
app.use(express.json()); //  parses JSON format request body and return req.body object
app.use(express.urlencoded({ extended: true })); // parses urlencoded format request body to req.body object
app.use(express.static("public")); //  Can serve static files to client at => http://localhost:5000/readme.txt

app.use("/api/courses", courses);
app.use("/", home);

// morgan is 3rd party middleware func - it logs every request received
// To ensure its enabled only in dev environment
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

//Custom middleware function - takes 3 args-> req,res and next
//its a good practice to make custom middleware as separate module and then require it like for below
app.use(logger);

//Another custom middleware
app.use(function(req, res, next) {
  console.log("Authentication middleware");
  next(); //passes control to next middleware. Here its Route middleware which sends response
});
//----------------------------------------------------------------------------------------------------

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));
