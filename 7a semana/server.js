var express = require('express')
var http = require('http')
var logger = require('morgan')
var pug = require('pug')
var url = require('url');
var fs = require('fs')
var jsonfile = require('jsonfile')
var formidable = require('formidable')
var uuidv4 = require('uuid/v4')

// Falta tornar a aplicação single page

var app = express();
var catalog = 'data/catalog.json';

app.use(logger('combined'));

app.use('/file', express.static('uploaded'));

app.all('*', (req,res,next) => {
    if(req.url != '/w3.css')
        res.writeHead(200, {'Content-Type': 'text/html'})
    next();
})

app.get('/', (req,res) => {
    jsonfile.readFile(catalog, (err, data)=>{
        if(!err){
            res.write(pug.renderFile('pug/form-upload.pug', {catalog: data}));
        } else {
            res.write(pug.renderFile('pug/error.pug', {e:err}))
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
                        fields.id = uuidv4();
                        data.push(fields);
                        jsonfile.writeFile(catalog, data, (err)=>{
                            if(!err){
                                res.write(pug.renderFile('pug/file-received.pug', 
                                    {file: fields}));
                                res.end();
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


http.createServer(app).listen(6400, ()=>{console.log('Listening on: 6400')});