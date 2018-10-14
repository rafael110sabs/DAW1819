var http = require('http')
var url = require('url')
var fs = require('fs');

http.createServer( (req,res) => {

    var myObj = url.parse(req.url, true)
    res.writeHead(200, {'Content-Type':'text/html'})

    if(myObj.pathname == '/'){
        fs.readFile('website/index.html', (erro, dados)=>{
            if(!erro)
                res.write(dados)
            else
                res.write('<p><b>ERRO: </b>' + erro + '</p>')
            res.end()
        })
    } else {
        fs.readFile('website' + myObj.pathname, (erro, dados)=>{
            if(!erro)
                res.write(dados)
            else
                res.write('<p><b>ERRO: </b>' + erro + '</p>')
            res.end()
        })
    }
    

}).listen(4001, () => {
    console.log("Servidor à escuta em 4001");
});