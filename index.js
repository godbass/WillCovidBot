"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

app.post("/echo", function (req, res) {

    var response = "C'est un essai";
    var pays = req.body.queryResult.parameters.pays;
    var statsoms = req.body.queryResult.parameters.statsoms;

  /*
  */

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

/*
*/

app.listen(process.env.PORT || 8000, function () {
    console.log("Server up and listening");
});