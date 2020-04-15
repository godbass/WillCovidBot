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


// scraping stats covid19
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




// Simulation
var userInput = "Arabie saoudite";

// bot
app.post("/botcovid", function (req, res) {

    var response =
        req.body.queryResult &&
        req.body.queryResult.parameters &&
            req.body.queryResult.parameters.pays
            ? req.body.queryResult.parameters.pays
            : "Seems like some problem. Speak again.";

    // traitement des données depuis le fichier JSON
    var repTab = [];
    for (var i = 0; i < jsonFile.length; i++) {
        if (jsonFile[i]['pays'] == response) {
            repTab.push(jsonFile[i]['pays'], jsonFile[i]['confirmes'], jsonFile[i]['casparmillion'], jsonFile[i]['gueries'], jsonFile[i]['deces'])
        }
    }
    if (repTab[0]) {
        var repPays = repTab[0];
        var repCas = repTab[1];
        var repCasMillion = repTab[2];
        var repGueris = repTab[3];
        var repDeces = repTab[4];
        // console.log("Le pays " + repPays + " a maintenant " + repCas + " cas confirmés, " + repDeces + " décès et " + repGueris + " personnes guéries.");
    }
    else {
        // console.log("Oups !! Pays non pris en compte")
    }

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
        fulfillmentText: response + " est maintenant à " + repCas + " cas confirmés, " + repDeces + " deces et " + repGueris + " personnes guéries. \n Soit " + repCasMillion + " car pour un million de personnes.",
        response: "precieuse",
        displayText: "La vie",
        source: "webhook-statsCovid-sample"
    });
});


// traitement
let jsonData = fs.readFileSync('data.json');
var jsonFile = JSON.parse(jsonData);

app.listen(process.env.PORT || 8000, function () {
    console.log("Server up and listening");
});