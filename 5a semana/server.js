var http = require('http')
var fs = require('fs')
var url = require('url')
var pug = require('pug')

http.createServer((req,res)=>{
    var purl = url.parse(req.url, true);

    var partreg = /\/partitura\//;
    
    if(purl.pathname == '/' || (purl.pathname == '/index') ){
        res.writeHead(200, {'Content-Type':'text/html'});
        fs.readFile('website/index.json', (erro, dados)=>{
            if(!erro)
                res.write(pug.renderFile('website/pug/index.pug', { partituras : JSON.parse(dados)}));
            else
                res.write('<p><b>ERRO: </b>' + erro + '</p>');
            res.end();
        });
    } else if(partreg.test(purl.pathname)){
        res.writeHead(200, {'Content-Type':'text/html'});
        let id = purl.pathname.split('/')[2];
        fs.readFile('website/json/'+id+'.json', (erro, dados)=>{
            if(!erro)
                res.write(pug.renderFile('website/pug/template.pug', { part : JSON.parse(dados)}));
            else
                res.write('<p><b>ERRO: </b>' + erro + '</p>');
            res.end();
        });
    } else if(purl.pathname == '/w3.css'){
        res.writeHead(200, {'Content-Type':'text/css'});
        fs.readFile('website/style/w3.css', (erro, dados)=>{
            if(!erro)
                res.write(dados);
            else
                res.write('<p><b>ERRO: </b>' + erro + '</p>');
            res.end();
        });
    } else {
        res.write('<h2>Não posso responder.</h2>');
        res.end();
    }
}).listen(5000, () => {
    console.log("Estou a ouvir no canal 5000");
})