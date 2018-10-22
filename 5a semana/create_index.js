var fs = require('fs');

var index = "website/index.json";

fs.readdir('website/json', (err, items) => {

    fs.writeFile(index,"[", (err) =>{
        if (err) throw err;

        for (var i=0; i<items.length; i++) {

            //proceder a leitura de cada json
            if(items[i].includes(".json")){
                
                fs.readFile('website/json/'+items[i], (err, dados)=>{
                    var json = JSON.parse(dados);

                    if(i != 0 ){
                        fs.appendFileSync(index,",", (err) => {
                            if(err)throw err;
                        });
                    }
                    
                    var partitura = '{\n\t\"id\":\"' + json._id + '",\n\t"titulo":"' + json.titulo + '"\n}';
                    fs.appendFileSync(index, partitura, (err) => {
                        if(err)throw err;
                    });
    
                })
            }
        }
        fs.appendFile(index,"]", (err) => {
            if(err)throw err;
        });
    }); 
});

