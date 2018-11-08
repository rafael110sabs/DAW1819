var express = require('express');
var formidable = require('formidable');
var jsonfile = require('jsonfile')
var fs = require('fs')
var router = express.Router();

var catalog = './data/files.json'

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(__dirname);
  res.render('index');
});

router.post('/processaForm', (req,res) => {
  var form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
      var fsent = files.file.path;
      var fnew = './public/uploaded/'+files.file.name

      fs.rename(fsent, fnew, err => {
          if(!err){
              jsonfile.readFile(catalog, (err, data)=>{
                  if(!err){
                      fields.update = new Date().toLocaleString('en',{timeZone: 'UTC', hour12: false});
                      fields.name = files.file.name;
                      fields.path = fnew;
                      data.push(fields);
                      jsonfile.writeFile(catalog, data, (err)=>{
                          if(!err){
                              res.json( {text:'The file was uploaded!'} );
                          } else {
                              res.render('error.pug', {e: 'Error writing to the catalog.'});
                          }
                      })
                  } else {
                      res.render('error', {e: 'Error reading the catalog.'});
                  }
              })

          } else {
              res.render('error', {e: 'Some error occurred.'});
          }
      })
  });
});

router.get('/tabledata', (req,res, next) => {
  jsonfile.readFile(catalog, (err,data)=>{
      if(!err)
        res.render('table-template.pug', {catalog:data});
  });
})

module.exports = router;
