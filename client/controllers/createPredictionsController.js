app.controller('createPredictionsCtrl', function($rootScope, $scope, $http, Notification, constantService, $location){
    $rootScope.isLogged();
    constantService.then(function(data){
        $scope.nationalities = data.nationalities;
        $scope.steps = data.steps;

        $scope.currentStep = 0;
        $scope.currentPlace = 1;
        $scope.currentNationalities = [];
        $scope.currentGroup = [];
        $scope.groupPredictions = [];

        $scope.currentMatches = [];
        $scope.cupPredictions = [];
        $scope.cupStage = false;
        $scope.loadCurrentNationalities = function () {
            angular.copy($scope.nationalities[$scope.currentStep].group, $scope.currentNationalities);
        };
        $scope.loadCurrentNationalities();

        $scope.nextStep = function() {
           $scope.groupPredictions[$scope.currentStep] = $scope.currentGroup;
            if($scope.currentStep !== 7){
                $scope.currentStep++;
               if(!$scope.groupPredictions[$scope.currentStep]){
                    $scope.loadCurrentNationalities();
                    $scope.currentGroup = [];
                    $scope.currentPlace = 1;
               }
               else {
                   $scope.currentGroup=$scope.groupPredictions[$scope.currentStep];
               }
            }
        };

        $scope.nextCupStep = function(){
            $scope.cupPredictions[$scope.currentStep-8] = $scope.currentMatches;
            if($scope.currentStep !== 13){
                $scope.currentStep++;
                    if($scope.currentStep === 9){
                        $scope.loadQuaterFinals();
                    }
                    if($scope.currentStep === 10){
                        $scope.loadSemiFinals();
                    }
                    if($scope.currentStep === 11){
                        $scope.loadThirdPlace();
                    }
                    if($scope.currentStep === 12){
                        $scope.loadFinal();
                    }
                    if($scope.currentStep === 13){
                        $scope.seeResult();
                    }
            }
        };

        $scope.prevCupStep = function () {
            if($scope.currentStep !== 8){
                $scope.currentStep--;
                $scope.currentMatches = $scope.cupPredictions[$scope.currentStep-8];
            }
        };

        $scope.prevStep = function() {
            if($scope.currentStep !== 0){
                $scope.currentStep--;
                $scope.currentGroup = $scope.groupPredictions[$scope.currentStep];
                $scope.currentNationalities = [];
            }
        };

        $scope.resetStep = function() {
            $scope.loadCurrentNationalities();
            $scope.currentGroup = [];
            $scope.currentPlace = 1;
        };

        $scope.chooseNat = function (id) {
            const index = $scope.currentNationalities.findIndex( record => record === id );
            const choosenTeam = $scope.currentNationalities.splice(index, 1);
            choosenTeam[0].place = $scope.currentPlace;
            $scope.currentPlace++;
            $scope.currentGroup.push(choosenTeam[0]);
        };

        $scope.groupStageDone = function () {
            $scope.currentStep = 8;
            $scope.cupStage = true;
            $scope.loadRoundOf16Matches();
        };

        $scope.loadRoundOf16Matches = function () {
            $scope.currentMatches = [];
            $scope.currentMatches.push([$scope.groupPredictions[0][0], $scope.groupPredictions[1][1]]);
            $scope.currentMatches.push([$scope.groupPredictions[2][0], $scope.groupPredictions[3][1]]);
            $scope.currentMatches.push([$scope.groupPredictions[4][0], $scope.groupPredictions[5][1]]);
            $scope.currentMatches.push([$scope.groupPredictions[6][0], $scope.groupPredictions[7][1]]);
            $scope.currentMatches.push([$scope.groupPredictions[1][0], $scope.groupPredictions[0][1]]);
            $scope.currentMatches.push([$scope.groupPredictions[3][0], $scope.groupPredictions[2][1]]);
            $scope.currentMatches.push([$scope.groupPredictions[5][0], $scope.groupPredictions[4][1]]);
            $scope.currentMatches.push([$scope.groupPredictions[7][0], $scope.groupPredictions[6][1]]);
        };

        $scope.loadQuaterFinals = function (){
            $scope.currentMatches = [];
            $scope.quaterFinalsTeams = [];
            angular.forEach($scope.cupPredictions[0], function(matchResult){
                var value = [];
                angular.copy(matchResult, value);
                if(value[0].win){
                    var teamOne = value[0];
                    teamOne.win = false;
                    $scope.quaterFinalsTeams.push(teamOne);
                }
                else {
                    var teamTwo = value[1];
                    teamTwo.win = false;
                    $scope.quaterFinalsTeams.push(teamTwo);
                }
            });
            $scope.currentMatches.push([$scope.quaterFinalsTeams[0], $scope.quaterFinalsTeams[1]]);
            $scope.currentMatches.push([$scope.quaterFinalsTeams[2], $scope.quaterFinalsTeams[3]]);
            $scope.currentMatches.push([$scope.quaterFinalsTeams[4], $scope.quaterFinalsTeams[5]]);
            $scope.currentMatches.push([$scope.quaterFinalsTeams[6], $scope.quaterFinalsTeams[7]]);
        };

        $scope.loadSemiFinals = function (){
            $scope.currentMatches = [];
            $scope.semiFinalsTeams = [];
            angular.forEach($scope.cupPredictions[1], function(matchResult){
                var value = [];
                angular.copy(matchResult, value);
                if(value[0].win){
                    var teamOne = value[0];
                    teamOne.win = false;
                    $scope.semiFinalsTeams.push(teamOne);
                }
                else {
                    var teamTwo = value[1];
                    teamTwo.win = false;
                    $scope.semiFinalsTeams.push(teamTwo);
                }
            });
            $scope.currentMatches.push([$scope.semiFinalsTeams[0], $scope.semiFinalsTeams[1]]);
            $scope.currentMatches.push([$scope.semiFinalsTeams[2], $scope.semiFinalsTeams[3]]);
        };

        $scope.loadThirdPlace = function (){
            $scope.currentMatches = [];
            $scope.ThirdTeams = [];
            angular.forEach($scope.cupPredictions[2], function(matchResult){
                var value = [];
                angular.copy(matchResult, value);
                if(!value[0].win){
                    var teamOne = value[0];
                    teamOne.win = false;
                    $scope.ThirdTeams.push(teamOne);
                }
                else {
                    var teamTwo = value[1];
                    teamTwo.win = false;
                    $scope.ThirdTeams.push(teamTwo);
                }
            });
            $scope.currentMatches.push([$scope.ThirdTeams[0], $scope.ThirdTeams[1]]);
        };

        $scope.loadFinal = function (){
            $scope.currentMatches = [];
            $scope.FinalTeams = [];
            angular.forEach($scope.cupPredictions[2], function(matchResult){
                var value = [];
                angular.copy(matchResult, value);
                if(value[0].win){
                    var teamOne = value[0];
                    teamOne.win = false;
                    $scope.FinalTeams.push(teamOne);
                }
                else {
                    var teamTwo = value[1];
                    teamTwo.win = false;
                    $scope.FinalTeams.push(teamTwo);
                }
            });
            $scope.currentMatches.push([$scope.FinalTeams[0], $scope.FinalTeams[1]]);
        };

        $scope.pickWinner = function (match, team) {
            const index = $scope.currentMatches.findIndex( record => record === match );
            if(team === 1){
                $scope.currentMatches[index][team].win = true;
                $scope.currentMatches[index][0].win = false;
            }
            else{
                $scope.currentMatches[index][team].win = true;
                $scope.currentMatches[index][1].win = false;
            }
        };

        $scope.isNextCupStagePossible = function () {
            var possible = true;
            angular.forEach($scope.currentMatches, function (value) {
                if(!value[0].win && !value[1].win){
                    possible = false;
                }
            });
            return possible;
        };

        $scope.seeResult = function () {
            $scope.postResults();
        };

        $scope.postResults = function () {
            $http.post('/predictions/addPredictions', {"userid": $rootScope.loggedUser._id, "username": $rootScope.loggedUser.login,"creationDate":moment().toDate(), "groupA": $scope.groupPredictions[0], "groupB": $scope.groupPredictions[1], "groupC": $scope.groupPredictions[2], "groupD": $scope.groupPredictions[3], "groupE": $scope.groupPredictions[4],"groupF": $scope.groupPredictions[5],"groupG": $scope.groupPredictions[6],"groupH": $scope.groupPredictions[7],"roundOf16": $scope.cupPredictions[0],"quaterFinals": $scope.cupPredictions[1], "semiFinals": $scope.cupPredictions[2],"thirdPlace": $scope.cupPredictions[3], "final": $scope.cupPredictions[4]}).then(function (response) {
                $location.path('/myPredictions');
                Notification.success({message: 'Twoje typy zostały poprawnie zapisane!', delay:5000});
            });
        }
    });
});