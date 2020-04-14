"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')

const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());


// Simulation
var userInput = "Arabie saoudite";


// scraping
function scrapData() {
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
                    'pays': recupTable[0],
                    'confirmes': recupTable[1],
                    'casparmillion': recupTable[2],
                    'gueries': recupTable[3],
                    'deces': recupTable[4]
                })
            });

            let sendJson = JSON.stringify(dataTable);
            fs.writeFileSync('data.json', sendJson);
        }
    });
}
scrapData()


// traitement
let jsonData = fs.readFileSync('data.json');
var jsonFile = JSON.parse(jsonData);

// methode classique
var repTab = [];
for (var i = 0; i < jsonFile.length; i++) {
    if (jsonFile[i]['pays'] == userInput) {
        repTab.push(jsonFile[i]['pays'], jsonFile[i]['confirmes'], jsonFile[i]['casparmillion'], jsonFile[i]['gueries'], jsonFile[i]['deces'])
    }
}
if (repTab[0]) {
    var repPays = repTab[0];
    var repCas = repTab[1];
    var repCasMillion = repTab[2];
    var repGueris = repTab[3];
    var repDeces = repTab[4];
    console.log("Le pays " + repPays + " a maintenant " + repCas + " cas confirmés, " + repDeces + " décès et " + repGueris + " personnes guéries.");
}
else {
    console.log("Oups !! Pays non pris en compte")
}


function traitement(pays, stat) {
    /*pays = jsonFile.pays;
    casConfirm = jsonFile.confirmes;
    casParMillion = jsonFile.casparmillion;
    gueris = jsonFile.gueries;
    deces = jsonFile.deces;*/
}
traitement()


/*map et filter
 * 
var tabPays = jsonFile.map(x => x['pays']);
var listPaysfilter = tabPays.filter(x => x == userInput);
console.log(listPaysfilter[0])
*/


// bot
app.post("/statsoms", function (req, res) {

    var response = "C'est un essai";
    var pays = req.body.queryResult.parameters.pays;
    var statsoms = req.body.queryResult.parameters.statsoms;

    txt().then((response) => {
        console.log(response)
        let rawdata = fs.readFileSync('info.json');
        info = JSON.parse(rawdata);
        console.log(info)
    }).catch((error) => {
        console.log("Error")
    })


    var speechResponse = {
        google: {
            expectUserResponse: true,
            richResponse: {
                items: [
                    {
                        simpleResponse: {
                            textToSpeech: response
                        }
                    }
                ]
            }
        }
    };

    return res.json({
        payload: speechResponse,
        //data: speechResponse,
        fulfillmentText: response,
        response: response,
        displayText: response,
        source: "webhook-echo-sample"
    });
});


app.listen(process.env.PORT || 8000, function () {
    console.log("Server up and listening");
});