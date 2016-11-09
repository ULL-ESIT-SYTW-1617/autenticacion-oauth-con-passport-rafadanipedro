var express = require('express');
var colors = require('colors');
var app = express();
 
app.use(express.static('gh-pages'));

app.listen(8080);

console.log("SERVIDOR PRACTICA 3 SYTW rafadanipedro".green);
console.log("Ejecutando servidor".green);
