const logger = require("./loggerMiddleware");
const express = require("express");
const joi = require("@hapi/joi");
const morgan = require("morgan");
const config = require("config");
const startUpDebugger = require("debug")("app:startUp"); // set DEBUG=app:startUp, app:db or (db:*)
const dbDugger = require("debug")("app:db");

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

const courses = [
  { id: 1, name: "React" },
  { id: 2, name: "Node" },
  { id: 3, name: "JavaScript" }
];

//Final middleware (Route middleware) that sends response and end req-res-cycle
app.get("/", (req, res) => {
  res.send("Hello World !!!"); //sends response
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with given ID was not available");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Check if course exists, if not send 404 status
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with given ID was not available");

  //check if body is valid, if not send 400 status
  const result = validateCourse(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  //update course and send the updated course object
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  //Check if course exist, if not send 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with given ID was not available");

  //Delete and send the deleted course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));

function validateCourse(course) {
  const schema = {
    name: joi
      .string()
      .min(3)
      .required()
  };
  return joi.validate(course, schema);
}
