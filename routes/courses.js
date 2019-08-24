const express = require("express");
const joi = require("@hapi/joi");

const router = express.Router();

const courses = [
  { id: 1, name: "React" },
  { id: 2, name: "Node" },
  { id: 3, name: "JavaScript" }
];

//Final middleware (Route middleware) that sends response and end req-res-cycle

router.get("/", (req, res) => {
  res.send(courses);
});

router.get("/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with given ID was not available");
  res.send(course);
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  //Check if course exist, if not send 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with given ID was not available");

  //Delete and send the deleted course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: joi
      .string()
      .min(3)
      .required()
  };
  return joi.validate(course, schema);
}

module.exports = router;
