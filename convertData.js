//Converter Class
var Converter = require("csvtojson").Converter;
var converter = new Converter({});
converter.fromFile("./data/fake-data.csv",function(err,result){
 console.log(JSON.stringify(result));
});
