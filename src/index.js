// const ExcelJS = require("exceljs/dist/es5");

// const { exec } = require("child_process");
// // exec("clear");
// // // console.clear();
// // console.log("teste");

// const reader = require("xlsx");
// const { utils } = reader;
// const { log } = require("console");

// const file = reader.readFile("./total-anuncios.xlsx");
// const file = reader.readFile("./teste-clear.xlsx");

// const sheets = file.SheetNames;

// let data = [];

// console.log(sheets);

// let auxData = utils.sheet_to_json(file.Sheets[file.SheetNames[2]]);

// for (let i = 0; i < sheets.length; i++) {
//   const tmp = reader.utils.sheet_to_json(file.SheetNames[i]);
//   tmp.forEach((res) => {
//     data.push(res);
//   });
// }

// auxData.forEach((item) => {
//   //   log(item.TITLE);
//   data.push(item);
// });

// for (let i = 0; i < 5; i++) {
//   //   log(data[i]);
// }

// log(auxData.length);

/* 

bloco para criar a logica de mapear o preco dos produtos que possuem mais de um sku
*/
// let tmmm = "teste";
// let how = tmmm.split("/");
// for (let k in how) {
//   log(how[k]);
// }

// for (item in auxData) {
//   console.log(item.TITLE);
// }
// log(auxData);

// exec("clear");
// // console.clear();
// console.log("teste");

const { exec } = require("child_process");
const reader = require("xlsx");
const { utils } = reader;
const { log } = require("console");

// let teste = { "01235": "batata" };
// let sheet = { sku: "012315", ITEM_ID: "MLB989054979" };
// sheet[sheet.sku]
// log(teste);

/* 



// Requiring module 
const reader = require('xlsx') 
  
// Reading our test file 
const file = reader.readFile('./test.xlsx') 
  
// Sample data set 
let student_data = [{ 
    Student:'Nikhil', 
    Age:22, 
    Branch:'ISE', 
    Marks: 70 
}, 
{ 
    Student:'Amitha', 
    Age:21, 
    Branch:'EC', 
    Marks:80 
}] 
  
convertendo os dados de json para planilha
const ws = reader.utils.json_to_sheet(student_data) 
  gravando os dados
reader.utils.book_append_sheet(file,ws,"Sheet3") 
  
// Writing to our file 
reader.writeFile(file,'./test.xlsx') 

*/

const dataBaseSheet = reader.readFile("./RELATORIO-FROM-SAMOEL.xlsx");
// toda a lista base de produtos convertida para
let dataBase = utils.sheet_to_json(
	dataBaseSheet.Sheets[dataBaseSheet.SheetNames[0]]
);
// log(utils.sheet_to_json(dataBase)[0]);

const mlProdutosSheet = reader.readFile("./total-anuncios.xlsx");

/* 

bloco de funções base para o funcoonamento da aplicação, como remover acentos, caracteres epeciais, espaços em branco ..
*/

const removeAccents = str =>
	str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const cleanTextBarras = str => str.replace(/[\\/]/g, "");
const cleanTextTracos = str => str.replace(/[-\+]/g, "");
const cleanTextWhiteSpaces = str => str.replace(/[ ]/g, "");

// local para armazenar os produtos que estão com tag indisponiveis
let produtosIndispoiveis = [];

for (let dbproduto in dataBase) {
	let produto = dataBase[dbproduto];
	// log(dataBase[dbproduto]["DIS"]);
	let disponibilidade = produto["DISPONIBILIDADE"].toUpperCase();
	disponibilidade = removeAccents(disponibilidade);
	if (disponibilidade == "indisponivel".toUpperCase()) {
		// log(produto);
		produtosIndispoiveis.push(produto);
	}
}

// let text = "666-66484484+64646   asdasda  asdasd  ";
// log(text);
// log(cleanTextWhiteSpaces(text));
