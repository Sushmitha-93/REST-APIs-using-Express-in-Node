const express = require("express");
const joi = require("@hapi/joi");

// Creates server which can listen to a port specified
const app = express(); //returns an express object which has many functions
app.use(express.json()); // http body-parser

const courses = [
  { id: 1, name: "React" },
  { id: 2, name: "Node" },
  { id: 3, name: "JavaScript" }
];

app.get("/", (req, res) => {
  res.send("Hello World !!!");
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
