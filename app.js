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
    console.log(req.files);
    let files = req.files.file;
    if (Array.isArray(files)) {
      //for multiple files chosen, but seems not working with Mac
      files.forEach((_file) => {
        fs.writeFileSync(uploadedDirectory + "/" + _file.name, _file.data);
        memory[_file.name] = _file.data;
        res.send(
          `You successfully uploaded your file! Go to the home page to download them.`
        );
      });
    } else {
      const file = req.files.file;
      fs.writeFileSync(uploadedDirectory + "/" + file.name, file.data);
      memory[file.name] = file.data;
      res.send(
        `You successfully uploaded your file : ${file.name}.\n You can now download it in http://localhost:8000/download/${file.name}`
      );
    }
  } else {
    res.redirect("/");
  }
});

//list out all photo
app.get("/file-list", (req, res) => {
  var fileArr = fs.readdirSync(uploadedDirectory); //go to the directory (readdirSync()), not the folder files (readFileSync())
  res.send(fileArr);
});

//download photo
app.get("/download/:name", (req, res) => {
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
