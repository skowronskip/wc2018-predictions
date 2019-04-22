app.controller('myPredictionsCtrl', function($rootScope, $scope, $http, Notification, constantService, predictionsService, $location){
    $rootScope.isLogged();
    constantService.then(function(data) {
        $scope.nationalities = data.nationalities;
        $scope.steps = data.steps;
        $scope.currentGroup = 0;
        predictionsService.getMyPredictions().then(function (predictions) {
            $scope.predictions = predictions;
            $scope.groups = [];
            $scope.cupStage = [];
            $scope.groups.push($scope.predictions.groupA);
            $scope.groups.push($scope.predictions.groupB);
            $scope.groups.push($scope.predictions.groupC);
            $scope.groups.push($scope.predictions.groupD);
            $scope.groups.push($scope.predictions.groupE);
            $scope.groups.push($scope.predictions.groupF);
            $scope.groups.push($scope.predictions.groupG);
            $scope.groups.push($scope.predictions.groupH);
            $scope.cupStage.push($scope.predictions.roundOf16);
            $scope.cupStage.push($scope.predictions.quaterFinals);
            $scope.cupStage.push($scope.predictions.semiFinals);
            $scope.cupStage.push($scope.predictions.thirdPlace);
            $scope.cupStage.push($scope.predictions.final);
            $scope.isRemoving = false;

            $scope.removePredictions = function () {
                $http.post('/predictions/deletePrediction', {"login": $rootScope.loggedUser.login}).then(function (response) {
                    $location.path('/createPredictions');
                    Notification.success({message: 'Twoje typy zostały usunięte.', delay: 5000});
                })
                    .catch(function (err) {
                        Notification.error({message: err.data, delay: 5000});
                    });

            };

            $scope.copied = function () {
                Notification.success({message: 'Link został skopiowany do schowka!', delay: 5000});
            };
        });
    });


});