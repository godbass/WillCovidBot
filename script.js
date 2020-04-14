const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')

var info = {}

//var userInput = "Serbie";

//async function txt() {
function txt() {

    request('https://news.google.com/covid19/map?hl=fr&gl=FR&ceid=FR:fr', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const siteTable = $('#yDmH0d > c-wiz > div > div.FVeGwb.ARbOBb > div.BP0hze > div.y3767c > div > div > c-wiz.dzRe8d.pym81b > div > table > tbody > tr ');
            let dataTable = [];

            siteTable.each((index, element) => {
                var recupTable = []
                $(element.children).each((index1, element2) => {
                    recupTable.push($(element2).text())
                });

                dataTable.push({
                    'Emplacement': recupTable[0],
                    'Confirmés': recupTable[1],
                    'Cas pour 1 million de personnes': recupTable[2],
                    'Personnes guéries': recupTable[3],
                    'Décès': recupTable[4]
                })
            });

            let jsonData = JSON.stringify(dataTable);
            fs.writeFileSync('info.json', jsonData);

            let rawdata = fs.readFileSync('info.json');
            info = JSON.parse(rawdata);
            console.log(info)
        }
    });
}

txt()

//txt().then((response) => {

//    console.log(response)

//    let rawdata = fs.readFileSync('info.json');
//    info = JSON.parse(rawdata);
//    console.log(info)

//}).catch((error) => {

//    console.log("Error")

//})

