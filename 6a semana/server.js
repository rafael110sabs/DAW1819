var http = require('http')
var fs = require('fs')
var url = require('url')
var pug = require('pug')
var {parse} = require('querystring')
var jsonfile = require('jsonfile')
var uuidv4 = require('uuid/v4');

//adicionar a func de editar a tarefa.
    //adicionar a action para o PUT da rota /edit
//Melhorar o css - tá lindo

http.createServer((req, res) => {

    var purl = url.parse(req.url, true);
    var query = purl.query;
    //console.log('Método: ' + req.method)
    var bd = "data/todos.json";

    if(req.method == 'GET'){
            
        if(purl.pathname == '/' || purl.pathname == '/index'){
                // GET INDEX
            jsonfile.readFile(bd, (erro, dados)=>{
                if(!erro){
                    res.writeHead(200, {'Content-Type':'text/html'});
                    res.write(pug.renderFile('pug/index.pug', {lista: dados}))
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type':'text/html'});
                    res.write(pug.renderFile('pug/erro.pug', {e: purl.pathname}));
                    res.end();
                }
            });

        } else if(purl.pathname == '/todo'){
                // GET TODO
            jsonfile.readFile(bd, (erro, dados) => {

                let resultado = undefined;
                    dados.forEach(element => {
                    if(element.id == query.id)
                        resultado = element;
                    });

                res.writeHead(200, {'Content-Type':'text/html'});
                if(erro){
                    res.end(pug.renderFile('pug/erro.pug', {e: 'Error reading database...'}));
                } else {
                    if(resultado != undefined){
                        resultado.date = new Date(resultado.date).toLocaleString();
                        resultado.expiration =  new Date(resultado.expiration).toLocaleString();
                        res.end(pug.renderFile('pug/todo-info.pug', {info: 'Information about this task:', todo: resultado}));
                    }else{
                        res.end(pug.renderFile('pug/erro.pug', {e: 'Task not found!'}));
                    }

                }
            });

        } else if(purl.pathname == '/done'){
                // MARK AS DONE
            jsonfile.readFile(bd, (erro, dados)=>{

                dados.forEach(element =>{
                    if(element.id == query.id)
                        element.done = true;
                });

                res.writeHead(200, {'Content-Type':'text/html'});
                if(!erro){
                    jsonfile.writeFile(bd, dados, erro =>{
                        
                        if(!erro){
                            res.end(pug.renderFile('pug/index.pug', {lista: dados}))
                        } else {
                            res.end(pug.renderFile('pug/erro.pug', {e: 'Error updating the database'}))
                        }
                    })

                } else {
                    res.end(pug.renderFile('pug/erro.pug', {e: 'Error reading the database...'}))
                }

            });
            
        } else if(purl.pathname == '/undone'){
                // MARK AS UNDONE
            jsonfile.readFile(bd, (erro, dados)=>{

                dados.forEach(element =>{
                    if(element.id == query.id)
                        element.done = false;
                });

                res.writeHead(200, {'Content-Type':'text/html'});
                if(!erro){
                    jsonfile.writeFile(bd, dados, erro =>{
                        
                        if(!erro){
                            res.end(pug.renderFile('pug/index.pug', {lista: dados}))
                        } else {
                            res.end(pug.renderFile('pug/erro.pug', {e: 'Error updating the database'}))
                        }
                    })

                } else {
                    res.end(pug.renderFile('pug/erro.pug', {e: 'Error reading the database...'}))
                }
            });
            
        } else if(purl.pathname == '/remove'){
                // MARK AS UNDONE
            jsonfile.readFile(bd, (erro, dados)=>{
                let i = 0
                dados.forEach(element =>{
                    if(element.id == query.id)
                        dados.splice(i,1);
                    i++;
                });

                res.writeHead(200, {'Content-Type':'text/html'});
                if(!erro){
                    jsonfile.writeFile(bd, dados, erro =>{
                        
                        if(!erro){
                            res.end(pug.renderFile('pug/index.pug', {lista: dados}))
                        } else {
                            res.end(pug.renderFile('pug/erro.pug', {e: 'Error updating the database'}))
                        }
                    })

                } else {
                    res.end(pug.renderFile('pug/erro.pug', {e: 'Error reading the database...'}))
                }
            });
            
        } else if(purl.pathname == '/edit'){
            // MARK AS UNDONE
            jsonfile.readFile(bd, (erro, dados)=>{
                let i = 0
                let resultado = undefined;
                dados.forEach(element =>{
                    if(element.id == query.id)
                        resultado = element
                    i++;
                });

                if(resultado != undefined){
                    res.writeHead(200, {'Content-Type':'text/html'});
                    if(!erro){
                        jsonfile.writeFile(bd, dados, erro =>{
                            
                            if(!erro){
                                resultado.date = new Date(resultado.date).toLocaleString();
                                res.end(pug.renderFile('pug/todo-edit.pug', {todo: resultado}));
                            } else {
                                res.end(pug.renderFile('pug/erro.pug', {e: 'Error updating the database'}))
                            }
                        })

                    } else {
                        res.end(pug.renderFile('pug/erro.pug', {e: 'Error reading the database...'}))
                    }
                } else {
                    res.end(pug.renderFile('pug/erro.pug', {e: 'Task not found!'}))
                }
            });
        
        } else if(purl.pathname == '/w3.css'){
    
            res.writeHead(200, {'Content-Type':'text/css'});
            fs.readFile('style/w3.css', (err,dados) =>{
                if(err)
                    res.write(pug.renderFile('pug/erro.pug', {e:err}))
                else
                    res.write(dados);
                res.end();
            })
    
        }else if(purl.pathname == '/mystyle.css'){
    
            res.writeHead(200, {'Content-Type':'text/css'});
            fs.readFile('style/mystyle.css', (err,dados) =>{
                if(err)
                    res.write(pug.renderFile('pug/erro.pug', {e:err}))
                else
                    res.write(dados);
                res.end();
            })
    
        } else {
    
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(pug.renderFile('pug/erro.pug', {e: purl.pathname}));
            res.end();
    
        }

    } else if(req.method == 'POST'){
        
        if(purl.pathname == '/todo'){
                // POST TODO
            recuperaInfo(req, resultado => {
                
                if(resultado != null){

                    resultado.date = new Date();
                    //resultado.expiration =  new Date(resultado.expiration).toLocaleString();
                    resultado.id = uuidv4();
                    resultado.done = false;

                    res.writeHead(200, {'Content-Type':'text/html'});
                    jsonfile.readFile(bd, (erro, dados) => {
                        if(!erro){
                            dados.push(resultado);
                            jsonfile.writeFile(bd,dados, erro => {

                                if(erro){
                                    res.end(pug.renderFile('pug/erro.pug', {e: 'Não consegui guardar na BD.'}));
                                } else {
                                    resultado.date = new Date(resultado.date).toLocaleString();
                                    resultado.expiration =  new Date(resultado.expiration).toLocaleString();
                                    res.end(pug.renderFile('pug/todo-info.pug', {info: 'A task was added!', todo: resultado}));
                                }

                            });
                        }
                    });
                }

            });
        
        } else if(purl.pathname == '/edit'){
            // POST EDIT
            recuperaInfo(req, resultado => {
                
                if(resultado != null){

                    res.writeHead(200, {'Content-Type':'text/html'});
                    jsonfile.readFile(bd, (erro, dados) => {

                        if(!erro){

                            let i = 0
                            dados.forEach(element =>{
                                if(element.id == query.id)
                                    dados.splice(i,1);
                                i++;
                            });

                            resultado.id = query.id;
                            resultado.date = new Date();
                            resultado.done = (resultado.done === 'true');

                            dados.push(resultado);
                            jsonfile.writeFile(bd,dados, erro => {

                                if(erro){
                                    res.end(pug.renderFile('pug/erro.pug', {e: 'Não consegui guardar na BD.'}));
                                } else {
                                    resultado.date = new Date(resultado.date).toLocaleString();
                                    resultado.expiration =  new Date(resultado.expiration).toLocaleString();
                                    res.end(pug.renderFile('pug/todo-info.pug', {info: 'The task was updated!', todo: resultado}));
                                }

                            });
                        }
                    });
                }

            });
    
        }else {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(pug.renderFile('pug/erro.pug', {e: 'Não conheço ' + purl.pathname}));
            res.end();
        }

    } else {
        res.writeHead(200, {'Content-Type':'text/html'});
            res.write(pug.renderFile('pug/erro.pug', {e: 'Método ' + req.method + ' não implementado!'}));
            res.end();
    }

}).listen(5005, () => {
    console.log('Estou a ouvir no canal 5005.');
})

function recuperaInfo(request, callback){
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded'){

        let body = '';
        request.on('data', bloco => {
            body += bloco.toString();
        })
        request.on('end', () => {
            callback(parse(body));
        })

    } else callback(null);
}
