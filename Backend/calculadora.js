'use strict'

//captura un numero N de parametros por consola desde el indice indicado
//(El indice 1 es la ruta del archivo por lo que todo comienza desde el 2)
//el indice 0 es la ruta de node
var params = process.argv.slice(2);

//Los parametros vienen en formato string
var numero1 = parseFloat(params[0]);
var numero2 = parseFloat(params[1]);

var divi;

if (numero2==0) {
    divi= 'Indeterminado';
}else{
    divi = numero1/numero2;
}

var plantilla = `
La suma es: ${numero1+numero2}
La resta es: ${numero1-numero2}
La multiplicacion es: ${numero1*numero2}
La division es: ${divi}
`;

console.log(plantilla);
console.log("hola mundo con NodeJS");