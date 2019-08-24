const express = require("express"); // 1

const router = express.Router(); //2

router.get("/", (req, res) => {
  res.send("Hello World !!!"); //sends response
});

module.exports = router; //3
