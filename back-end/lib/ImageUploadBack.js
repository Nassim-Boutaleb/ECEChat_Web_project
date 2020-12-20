const express = require('express');
const path = require("path");
const multer = require("multer");
const fs = require('fs');
const router = express.Router();
const {v4: uuid} = require('uuid')

const storage = multer.diskStorage({
   destination: function(req, res , cb) {
      cb(null, './../front-end/src/Images');
   },
   filename: function(req,file, cb){
      const id = uuid();
      cb(null,`customImage${id}.png`);
   }
})


const uploads = multer({storage});

module.exports = uploads;