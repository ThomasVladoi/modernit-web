// 1. Laske kaksi komentoriviargumenttia yhteen
const num1 = Number(process.argv[2]);
const num2 = Number(process.argv[3]);

console.log("Summa:", num1 + num2);

// 2. Tulosta tervehdys isoin kirjaimin
const name = process.argv[4];

console.log("Hei " + name.toUpperCase() + "!");
