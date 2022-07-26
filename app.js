const express = require("express");
const expressFileUpload = require("express-fileupload");
const app = express();

const fs = require("fs");
const promisfy = require("util.promisify");

app.use(expressFileUpload()); //for upload files
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

//Create a HTTP Server using Express
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index");
});

//for uploading photo
const uploadedDirectory = __dirname + "/uploaded";
const readFile = promisfy(fs.readFile);

//cache
let memory = {};

app.post("/upload", (req, res) => {
  if (req.files) {
    const file = req.files.file;
    console.log(file);
    fs.writeFileSync(uploadedDirectory + "/" + file.name, file.data);
    memory[file.name] = file.data;
    res.send(
      `You successfully uploaded your file : ${file.name}, plesse restart the server to download it.`
    );
  } else {
    res.redirect("/");
  }
});

//list out all photo
var fileArr = fs.readdirSync(uploadedDirectory); //go to the directory files, not the whole folder
app.get("/file-list", (req, res) => {
  console.log("fileArr : " + fileArr);
  res.send(fileArr);
});

//download photo
app.get("/download/:name", (req, res) => {
  console.log("fileArr : " + fileArr);
  console.log("hi download param", `${uploadedDirectory}/${req.params.name}`);
  readFile(`${uploadedDirectory}/${req.params.name}`).then((file) => {
    res.attachment(`${req.params.name}`);
    res.send(file);
  });
});

//access to cache data via POSTMAN
var number = 0;
app.get("/num", (req, res) => {
  res.send("Number : " + number.toString());
});
app.post("/num", (req, res) => {
  number++;
  res.send("You have added a number into : " + number.toString());
});
app.delete("/num", (req, res) => {
  if (number > 0) {
    number--;
    res.send("You just deleted a number into : " + number.toString());
  } else {
    res.send("No more number");
  }
});

//makes use of the cache
app.listen(8000, () => {
  console.log("Listening on Port: 8000");
});
