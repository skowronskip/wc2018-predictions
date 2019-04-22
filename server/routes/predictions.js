const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/PredictGame');
mongoose.connect('mongodb://typeruser:typermocnehaslo2@ds016128.mlab.com:16128/typermssd');
mongoose.Promise = global.Promise;
const Predictions = require('../model/predictionsModel');
var _ = require('lodash');
const groupResults = require('../results');
const cupResults = require('../cupresults');

router.post('/addPredictions', function(req, resp){
    Predictions.create(req.body).then(function (result) {
        resp.end();
    });
});

router.post('/userPredictions', function (req, resp) {
    Predictions.findOne({username: req.body.login}, function(err,obj){
        if (err) throw err;
        if(obj){
            assignGroupPoints(obj.groupA);
            assignGroupPoints(obj.groupB);
            assignGroupPoints(obj.groupC);
            assignGroupPoints(obj.groupD);
            assignGroupPoints(obj.groupE);
            assignGroupPoints(obj.groupF);
            assignGroupPoints(obj.groupG);
            assignGroupPoints(obj.groupH);
            resp.end(JSON.stringify(obj));
        }
        else{
            resp.status(409).end("Nie znaleziono takie użytkownika, bądź jeszcze nie zdążył się zapisać swoich typów.");
        }
    })
});

router.post('/myPredictions', function (req, resp) {
    Predictions.findOne({userid: req.body._id}, function(err,obj){
        if (err) throw err;
        if(obj){
            assignGroupPoints(obj.groupA);
            assignGroupPoints(obj.groupB);
            assignGroupPoints(obj.groupC);
            assignGroupPoints(obj.groupD);
            assignGroupPoints(obj.groupE);
            assignGroupPoints(obj.groupF);
            assignGroupPoints(obj.groupG);
            assignGroupPoints(obj.groupH);
            resp.end(JSON.stringify(obj));
        }
        else{
            resp.status(409).end("Nie znaleziono takie użytkownika, bądź jeszcze nie zdążył się zapisać swoich typów.");
        }
    })
});

router.post('/allPredictions', function (req, resp) {
    Predictions.find({}, function (err, predictions) {
        predictions.forEach(function (obj) {
           obj.groupPoints = calculatePoints(obj);
           obj.cupPoints = calculateRoundOf16Points(obj.roundOf16) + calculateQuaterFinalPoints(obj.quaterFinals) + calculateSemiFinalPoints(obj.semiFinals) + calculateFinalsPoints([obj.thirdPlace[0], obj.final[0]]);
        });
        resp.end(JSON.stringify(predictions));
    });
});

router.get('/currentGroupStandings', function (req,resp) {
   resp.end(JSON.stringify(groupResults));
});

router.post('/deletePrediction', function (req, resp) {
   Predictions.findOneAndRemove({username: req.body.login}, function (err,obj) {
       if(err) throw err;
       if(!obj) {
           resp.status(409).end("Nie znaleziono twoich typów, możesz teraz wprowadzić swoje nowe typy!.");
       }
       else{
           resp.end();
       }
   });
});

router.get('/topLists', function (req,resp) {
    Predictions.find({}, function (err, predictions) {
        var lastPrediction = predictions.length-1;
        var result =  [];
        var winners = [];
        var counted = [];
        var countedTop5 = [];
        var response = {};
        for(var i = lastPrediction; i >= 0; i--){
            var value = {};
            value.username = predictions[i].username;
            value.creationDate = predictions[i].creationDate;
            if(result.length !== 5){
                result.push(value);
            }
            if(predictions[i].final[0][0].win){
                var value = {};
                value.name = predictions[i].final[0][0].name;
                value.code = predictions[i].final[0][0].code;
                winners.push(value);
            }
            else {
                var value = {};
                value.name = predictions[i].final[0][1].name;
                value.code = predictions[i].final[0][1].code;
                winners.push(value);
            }
        }
        for(var i = 0; i<winners.length;i++){
            var found = false;
            for(var j=0;j<counted.length;j++){
                if(counted[j].name === winners[i].name){
                    found = true;
                    counted[j].occurences++;
                }
            }
            if(!found){
                winners[i].occurences = 1;
                counted.push(winners[i]);
            }
        }
        counted.sort(function (a,b) {
            return b.occurences - a.occurences;
        });
        for(var i = 0; i<5; i++){
            if(counted[i]){
                countedTop5.push(counted[i]);
            }
        }
        response.lastUsers = result;
        response.topWinners = countedTop5;
        resp.end(JSON.stringify(response));
    });
});

function calculateRoundOf16Points(matches) {
    let points = 0;
    _.forEach(matches, (teams) => {
        _.forEach(teams, (team) => {
            _.forEach(cupResults.roundOf16, (resultTeam) => {
                if(team.code === resultTeam.code && team.win) {
                    points +=15;
                }
            });
        });
    });
    return points;
}

function calculateQuaterFinalPoints(matches) {
    let points = 0;
    _.forEach(matches, (teams) => {
        _.forEach(teams, (team) => {
            _.forEach(cupResults.quaterFinals, (resultTeam) => {
                if(team.code === resultTeam.code && team.win) {
                    points +=20;
                }
            });
        });
    });
    return points;
}

function calculateSemiFinalPoints(matches) {
    let points = 0;
    _.forEach(matches, (teams) => {
        _.forEach(teams, (team) => {
            _.forEach(cupResults.semiFinals, (resultTeam) => {
                if(team.code === resultTeam.code && team.win) {
                    points +=25;
                }
            });
        });
    });
    return points;
}

function calculateFinalsPoints(matches) {
    let points = 0;
    _.forEach(matches[0], (thirdplace) => {
        if(thirdplace.code === cupResults.finals[0].code && thirdplace.win){
            points += 30;
        }
    });
    _.forEach(matches[1], (final) => {
        if(final.code === cupResults.finals[1].code && final.win){
            points += 50;
        }
    });
    return points;
}


function calculatePoints (predictions) {
    var points = calculateGroupPoints(predictions.groupA) + calculateGroupPoints(predictions.groupB) + calculateGroupPoints(predictions.groupC) + calculateGroupPoints(predictions.groupD) + calculateGroupPoints(predictions.groupE) + calculateGroupPoints(predictions.groupF) + calculateGroupPoints(predictions.groupG) + calculateGroupPoints(predictions.groupH);
    return points;
}
function assignGroupPoints(group) {
    var team = undefined;
    _.forEach(group, function (value) {
        value.points = 0;
        team = _.find(groupResults, function (results) {
            return results.code === value.code;
        });
        if (value.place === 1) {
            if (team.place === 1) {
                value.points += 10;
            }
            if (team.place === 2) {
                value.points += 5;
            }
        }
        if (value.place === 2) {
            if (team.place === 2) {
                value.points += 10;
            }
            if (team.place === 1) {
                value.points += 5;
            }
        }
        if (value.place === 3) {
            if (team.place === 3) {
                value.points += 10;
            }
            if (team.place === 4) {
                value.points += 5;
            }
        }
        if (value.place === 4) {
            if (team.place === 4) {
                value.points += 10;
            }
            if (team.place === 3) {
                value.points += 5;
            }
        }
    });
}

function calculateGroupPoints (group) {
    var points = 0;
    var team = undefined;
    _.forEach(group, function (value) {
       team = _.find(groupResults, function (results) {
           return results.code === value.code;
       });
       if(value.place === 1){
           if(team.place === 1){
               points += 10;
           }
           if(team.place === 2) {
               points += 5 ;
           }
       }
        if(value.place === 2){
            if(team.place === 2){
                points += 10;
            }
            if(team.place === 1) {
                points += 5 ;
            }
        }if(value.place === 3){
            if(team.place === 3){
                points += 10;
            }
            if(team.place === 4) {
                points += 5 ;
            }
        }if(value.place === 4){
            if(team.place === 4){
                points += 10;
            }
            if(team.place === 3) {
                points += 5 ;
            }
        }
    });
    return points;
}

module.exports = router;