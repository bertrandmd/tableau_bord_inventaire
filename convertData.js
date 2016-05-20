//Converter Class
var Converter = require("csvtojson").Converter;
var converter = new Converter({});
converter.fromFile("./data/fake-data-secteur2.csv",function(err,result){
 console.log(JSON.stringify(result));
});
