var express = require('express')
var http = require('http')
var logger = require('morgan')
var pug = require('pug')
var url = require('url');
var fs = require('fs')
var jsonfile = require('jsonfile')
var formidable = require('formidable')

var app = express();
var catalog = 'data/catalog.json';
var jsreg = /\/.+\.js/;

app.use(logger('combined'));

app.use('/file', express.static('uploaded'));

app.get('/', (req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    jsonfile.readFile(catalog, (err, data)=>{
        if(!err){
            res.write(pug.renderFile('pug/form-upload.pug'));
        } else {
            res.write(pug.renderFile('pug/error.pug', {e: "Connection to database is down."}))
        }
        res.end();
    })
});

app.get('/w3.css', (req,res) => {
    res.writeHead(200, {'Content-Type':'text/css'});
    fs.readFile('style/w3.css', (err,dados) =>{
        if(err)
            res.write(pug.renderFile('pug/error.pug', {e:err}))
        else
            res.write(dados);
        res.end();
    });
});

app.get('/*.js', (req,res) => {
    res.writeHead(200, {'Content-Type':'application/javascript'});
    fs.readFile('scripts'+req.url, (err,dados) =>{
        if(err)
            res.write(pug.renderFile('pug/error.pug', {e:err}))
        else
            res.write(dados);
        res.end();
    });
});

app.post('/processaForm', (req,res) => {
    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        var fsent = files.file.path;
        var fnew = './uploaded/'+files.file.name

        fs.rename(fsent, fnew, err => {
            if(!err){
                jsonfile.readFile(catalog, (err, data)=>{
                    if(!err){
                        fields.update = new Date().toLocaleString();
                        fields.name = files.file.name;
                        fields.path = fnew;
                        data.push(fields);
                        jsonfile.writeFile(catalog, data, (err)=>{
                            if(!err){
                                res.end(pug.renderFile('pug/table-template.pug', {catalog:data}))
                            } else {
                                res.write(pug.renderFile('pug/error.pug', {e: 'Error writing to the catalog.'}));
                                res.end();
                            }
                        })
                    } else {
                        res.write(pug.renderFile('pug/error.pug', {e: 'Error reading the catalog.'}));
                        res.end();
                    }
                })

            } else {
                res.write(pug.renderFile('pug/error.pug', {e: 'Some error occurred.'}));
                res.end();
            }
        })
    });
});

app.get('/tabledata', (req,res) => {
    jsonfile.readFile(catalog, (err,data)=>{
        if(!err)
            res.end(pug.renderFile('pug/table-template.pug', {catalog:data}))
    });
})

http.createServer(app).listen(6400, ()=>{console.log('Listening on: 6400')});