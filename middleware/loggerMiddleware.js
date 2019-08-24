//Custom middleware function - takes 3 args-> req,res and next
function log(req, res, next) {
  console.log("Logger middleware: ", req.url);
  next(); //passes control to next middleware. Here its Auth middleware
}

module.exports = log;
