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
const frete_preco = require("../db/frete-precos.json");
const { writeFile } = require("fs");
const { title } = require("process");
const Fuse = require("fuse.js");

const dataBaseSheet = reader.readFile("./produtos-relatorio.xlsx");
const mlProdutosSheet = reader.readFile("./total-anuncios-31-05-2.xlsx");

// log(frete_preco)

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
gravando novos dados em arquivos excel
reader.utils.book_append_sheet(file,ws,"Sheet3") 
  
// Writing to our file 
reader.writeFile(file,'./test.xlsx') 

*/

// toda a lista base de produtos convertida para
let dataBase = utils.sheet_to_json(dataBaseSheet.Sheets["Produtos"]);
// log(utils.sheet_to_json(dataBase)[0]);

let mlProdutosSheetNames = mlProdutosSheet.SheetNames;
// log(mlProdutosSheetNames[2]);

/*  e verboo, mas necessario para futura manutenção, aqui estou  definindo qua o nome da planilha que vou trabalhar */
// let mlProdutosWorkSheetName = mlProdutosSheetNames[2];

let mlProdutosTmp = utils.sheet_to_json(mlProdutosSheet.Sheets["Anúncios"]);
let cabecalho = [];

// mlProdutosTmp = mlProdutosTmp.shift();
// mlProdutosTmp = mlProdutosTmp.shift();
// mlProdutosTmp = mlProdutosTmp.shift();
// mlProdutosTmp = mlProdutosTmp.shift();
// let mlProdutos = mlProdutosTmp;
let mlProdutos = utils.sheet_to_json(mlProdutosSheet.Sheets["Anúncios"]);
// log(typeof mlProdutos);
/* 
criando cabeçalho da planilha
*/
let count = 0;
mlProdutos.map(data => {
	if (count < 4) {
		cabecalho.push(data);
		count++;
		// mlProdutos.shift()
		return data;
	} else {
		return data;
	}
});
mlProdutos.shift();
mlProdutos.shift();
mlProdutos.shift();
mlProdutos.shift();

// log({cabecalho})

// log(utils.sheet_to_json(mlProdutosSheet.Sheets['hidden']))

// log(mlProdutosWorkSheetName);
// log(mlProdutos);

// log(mlProdutos[4]);
/* 

nomes dos campos da planiha do mercado livre com os produtos

ITEM_ID
SKU
TITLE
VARIATIONS
QUANTITY
CHANNEL
MARKETPLACE_PRICE
MSHOPS_PRICE = 
MSHOPS_PRICE_SYNC
CURRENCY_ID
DESCRIPTION
STATUS

*/
// for (let key in mlProdutos[4]) {
// 	log(key);
// }

/* 

bloco de funções base para o funcoonamento da aplicação, como remover acentos, caracteres epeciais, espaços em branco ..
*/

const removeAccents = str =>
	str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const cleanTextBarras = str => str.replace(/[\\/]/g, "");
const cleanTextTracos = str => str.replace(/[-\+]/g, "");
const cleanTextWhiteSpaces = str => str.replace(/[ ]/g, "");
const checkRange = require("lodash").inRange;
const normSKU = sku => {
	// ''.
	let tmp = sku.toString();
	while (tmp.length < 5) {
		tmp = "0".concat("", tmp);
	}
	return tmp;
};

/* 
funcao para verificar o valor do frete com base na tabela armazanada no db/frete-precos.json

*/
const getFretePreco = peso => {
	// log(peso?true:false)
	let i = 0;
	let preco = 0;
	let frete = {};
	while (true) {
		frete = frete_preco[i];

		// log(frete)
		// frete.
		let { peso_a, peso_b } = frete;
		if (checkRange(peso, peso_a, peso_b)) {
			break;
		}

		i++;
		// break
	}
	return frete.valor;
};
// log(dataBase)
/* 

funcao para remapear produtos colocando o sku como key do objeto, deixando a interação com os dados mais perfomatica
*/
const mapDbProdutos = produtos => {
	let tmpProdutos = {};
	let produto = {};
	let produtoSKU = "";
	for (let i in produtos) {
		produto = produtos[i];
		// log(produto)
		produto.CODIGO_INTER = normSKU(produto.CODIGO_INTER);
		produtoSKU = produto.CODIGO_INTER;
		// produto.
		// log(produto.CODIGO_INTER)
		tmpProdutos[produtoSKU] = produto;

		// log(normSKU(produtoSKU))

		// if(produtoSKU.length<5 || produtoSKU[0] =='0'){
		// 	log(produtoSKU)
		// }
	}
	// log
	// log(tmpProdutos)
	return tmpProdutos;
};

const calculaPrecoMLeMSHops = produtoML => {
	let peso = 0,
		frePreco = 0;
	let mshopTaxa = 1.14;
	let mlTaxa = 1.23;
	let imposto = 1.2;
	let skus = produtoML["SKU"].split("/");
	log(skus);
};

// mapDbProdutos(dataBase)
/* 

mapeado e normaliando os dados da base de dados que vamos trabalhar
*/
const dbProdutos = mapDbProdutos(dataBase);

// let valorFrete = getFretePreco(5)
// log(valorFrete)

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

// log(produtosIndispoiveis)
let mapedProdutosIndisponiveis = {};
/* 

mapeando os produtos com estoque indisponivel
*/
for (let index = 0; index < produtosIndispoiveis.length; index++) {
	// const element = produtosIndispoiveis[index];
	let prod = produtosIndispoiveis[index];
	mapedProdutosIndisponiveis[prod.CODIGO_INTER] = prod;
	// log(prod)
}

// log(mapedProdutosIndisponiveis);

// let text = "666-66484484+64646   asdasda  asdasd  ";
// log(text);
// log(cleanTextWhiteSpaces(text));

const x = 4;
let teste = 0;

/*  */
/* 
função para verificar se um numero esta contido em determinado intervalo.
*/
// if (checkRange.inRange(x, 1, 3)) {
// 	// something
// 	log("deu certo");
// } else {
// 	log("none");
// }
let lastSemSKu = {};
let last = false;
let control = 0;
let savekey = undefined;

// for (let key in mlProdutos) {
// 	// log(key);
// 	let produto = mlProdutos[key];
// 	savekey = key;
// 	let sku = produto["SKU"] ? produto["SKU"] : "";
// 	// sku = normSKU(sku)
// 	// log(sku);
// 	let skuNumber = Number(sku).toString()
// 	if (skuNumber.length < 5) {
// 		// log("meno");
// 		// control++;
// 		// log(skuNumber)
// 		// log(Number(sku).toString())
// 	}
// }

/* 
normalizando todos os  SKU da planilha do mercaod livre, removendo +,- e espaços em branco
*/
let mlSKUs = [];
const mapMlSKU = () => {
	// variavel iniciada em 4 para pular o cabecalo da tabela
	let i = 4;
	let mlDbSize = mlProdutos.length;
	for (; i < mlDbSize; i++) {
		// log(mlProdutos[i]['SKU'])
		let teste = mlProdutos[i]["SKU"] ? "" + mlProdutos[i]["SKU"] : "";
		let sku = teste.toString();
		sku = normSKU(sku);
		// log(sku)
		// let tmpSku = sku.split('/')
		// for (let key in tmpSku){
		// 	tmpSku[key] =
		// }
		let cleanSKU = sku.replace(/[ ]/g, "");
		cleanSKU = cleanSKU.replace(/[-+]/g, "/");
		// cleanSKU = cleanSKU.replace('$','/')
		// log(cleanSKU)
		// mlSKUs.push({sku:cleanSKU, title: "mlProdutos[i]['TITLE']"})
		mlProdutos[i]["SKU"] = cleanSKU;
	}
};

/* 
funcao map para inserir sku nos anuncios sem sku

*/

const mapInserSKU = () => {
	// ITEM_ID
	let tmpProdutosCPL = {};
	let tmpMlprodutos = mlProdutos;
	let size = tmpMlprodutos.length;
	let init = 4;
	for (; init < size; init++) {
		let tmpMlproduto = tmpMlprodutos[init];

		let sku = tmpMlproduto["SKU"] ? tmpMlproduto["SKU"] : "";
		// log(tmpMlproduto.SKU)
		// log('SKU' in tmpMlproduto)
		// tmpMlproduto['SKU'] = tmpMlproduto['SKU']? tmpMlproduto['SKU'] : ''
		if (tmpMlproduto["SKU"] == undefined) {
			tmpMlproduto["SKU"] = "";
			log("undefined");
		}
		if (!"SKU" in tmpMlproduto) {
			log("Nao");
		}

		let skuSise = sku.split("/").length;
		let skunumber = 1;
		// verifico se tem mais de sku na mesma linha
		if (skuSise > 1) {
			// log('mult')
			// log({sku})
		} else {
			// log({skunumber,sku})
		}
		skunumber = Number(sku);
		if (skunumber != 0) {
			// while(true){
			// 	let key = init+1
			// 	let produtoTmp = tmpMlprodutos[key]
			// 	let tmpsku = produtoTmp['SKU'].split('')
			// }
			// log({atu: tmpMlprodutos[init]['ITEM_ID'], prox: tmpMlprodutos[init+1]['ITEM_ID']})
			// log('tets')
			// tmpProdutosCPL[tmpMlproduto['I']]
			// let aux ={}
			// aux[tmpMlproduto['ITEM_ID']] = tmpMlproduto['ITEM_ID']
			// log(aux)
			tmpProdutosCPL[tmpMlproduto["ITEM_ID"]] = tmpMlproduto["SKU"];
		}
		// log({skunumber,sku, title: tmpMlprodutos[init]['TITLE']})
	}
	for (init = 4; init < size; init++) {
		let tmpMlproduto = tmpMlprodutos[init];
		let sku = tmpMlproduto["SKU"];
		let skuSise = sku.split("/").length;
		let skunumber = 1;
		// verifico se tem mais de sku na mesma linha
		skunumber = Number(sku);
		if (!tmpMlproduto.hasOwnProperty("SKU")) {
			log("Nao");
		}
		// "SKU"

		if (skunumber == 0) {
			// while(true){
			// 	let key = init+1
			// 	let produtoTmp = tmpMlprodutos[key]
			// 	let tmpsku = produtoTmp['SKU'].split('')
			// }
			// log({atu: tmpMlprodutos[init]['ITEM_ID'], prox: tmpMlprodutos[init+1]['ITEM_ID']})
			// log('tets')
			// tmpProdutosCPL[tmpMlproduto['I']]
			// let aux ={}
			// aux[tmpMlproduto['ITEM_ID']] = tmpMlproduto['ITEM_ID']
			// log(aux)
			// tmpProdutosCPL[tmpMlproduto['ITEM_ID']] = tmpMlproduto['SKU']
			// tmpMlprodutos[init]['SKU'] =
			// log(tmpProdutosCPL[tmpMlproduto])
			// log(tmpMlproduto['SKU'])
			let id = tmpMlproduto["ITEM_ID"];
			tmpMlproduto["SKU"] = tmpProdutosCPL[id];
			// log(tmpMlproduto)
			// log(tmpMlproduto['SKU'])

			tmpMlprodutos[init] = tmpMlproduto;
		}
		// log({skunumber,sku, title: tmpMlprodutos[init]['TITLE']})
	}

	mlProdutos = tmpMlprodutos;
	// log(tmpProdutosCPL)
};

/* 
chamando a função para normalizar todos os skus
*/
mapMlSKU();

mapInserSKU();

/* removendo campos indefinidos */
mlProdutos.map(data => {
	if (data["SKU"] == undefined) {
		// log({data})
		data["SKU"] = "0";
	}
	// if(!data.hasOwnProperty("SKU")){
	// 	log({data})

	// }
	return data;
});

const checkDispnivel = produto => {
	let skus = produto["SKU"].split("/");
	let count = 0;
	skus.forEach(data => {
		let check = mapedProdutosIndisponiveis[data] ? false : true;
		if (!check) {
			count++;
			// log({ map: mapedProdutosIndisponiveis[data] });
		}
	});
	return count > 0 ? false : true;
};
/* 
verificando se algum dos codifos esta inativo
*/
mlProdutos.map(data => {
	// log(checkDispnivel(data) ? "ok" : "no");
	data["STATUS"] = checkDispnivel(data) ? "Ativa" : "Inativa";
	return data;
});

// log(mlProdutos)
// mlProdutos.map(data =>{

// 	if (data['SKU'] ==undefined) {
// 		// log({data})
// 		data['SKU'] = '0'
// 	}
// 	// if(!data.hasOwnProperty("SKU")){
// 	// 	log({data})

// 	// }
// 	return data
// })
// log(mlProdutos)

// for(let index = 4; index< mlProdutos.length; index++){
// 	let produto = mlProdutos[index]
// 	log({produto})
// 	let skus = produto['SKU'].split('/')
// 	for (let j in skus){
// 		log({j})
// 	}
// }

/*  */

const path = "./db/ml-sku.json";
// // const config = { ip: '192.0.2.1', port: 3000 };

writeFile(path, JSON.stringify(mlProdutos, null, 2), error => {
	if (error) {
		console.log("An error has occurred ", error);
		return;
	}
	console.log("Data written successfully to disk");
});
// log(savekey);
// log(control);

// mlProdutosSheet["Anúncios"] = undefined;
// utils.
// delete workbook.Sheets['your sheet name']
// mlProdutos = cabecalho.concat(mlProdutos);

const writeCnahges = (filename,data) => {
	// reader.writeFile(file,'./test.xlsx')
	const mldData = reader.utils.json_to_sheet(data);
	delete mlProdutosSheet.Sheets["Anúncios"];
	delete mlProdutosSheet.SheetNames["Anúncios"];
	// log(mlProdutosSheet.Workbook["Anúncios"]);

	// o segrede é apagar o index, senão ele não deixa inserir as novas tabelas ...

	let indexToDelete = mlProdutosSheet.SheetNames.indexOf("Anúncios");
	mlProdutosSheet.SheetNames.splice(indexToDelete, 1);
	reader.utils.book_append_sheet(mlProdutosSheet, mldData, "Anúncios");

	// utils.
	filename = filename.includes('.xlsx')? filename: `${filename}.xlsx`
	reader.writeFile(mlProdutosSheet, filename);
};



let kitProdutos = []
let semKitProdutos = []
log({sizeTotal: mlProdutos.length})

/* 

mapeado as descições dos anuncis em busca de anuncios que sejam kits
*/
mlProdutos.forEach(data => {
	let description = `${data["DESCRIPTION"]}`;
	description = description.toUpperCase();
	// log({ description });
	// let list = ["Old Man's War", "The Lock Artist", "Municipio"];
	const options = {
		includeScore: true,
		minMatchCharLength: 2,
	};

	const fuse = new Fuse([description], options);

	const result = fuse.search("KIT");
	let sku = data['SKU'].split('/')
	let skuSise = sku.length
	if (result.length> 0 && skuSise >1){
		kitProdutos.push(data)
		console.log({result});
	}
	else{
		semKitProdutos.push(data)
	}

	// if(description.includes('KIT')){
	// 	log({description})
	// }
});

kitProdutos = cabecalho.concat(kitProdutos)
semKitProdutos = cabecalho.concat(semKitProdutos)

log({semKitSize:semKitProdutos.length})


// writeCnahges('sem-kit',semKitProdutos)
// writeCnahges('com-kit',kitProdutos)

// const totalteste = reader.readFile("./ml-new-produtos.xlsx");

// log(utils.sheet_to_json(totalteste.Sheets["hidden"]));

// let array = [5, 10, 15, 20, 25, 30, 35];
// let newArray = array.slice(0, 5);

// console.log(newArray);

// let objeto = {};

// // objeto.push({ nome: "jose" });
// log({ objeto });
