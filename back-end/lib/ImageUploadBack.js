const express = require('express');
const path = require("path");
const multer = require("multer");
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
   destination: function(req, res , cb) {
      cb(null, './Image')
   },
   filename: function(req,file, cb){
      cb(null,'customImage.png')
   }
})


const uploads = multer({storage});

module.exports = uploads;