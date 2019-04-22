app.controller('userPredictionsCtrl', function($rootScope, $scope, $http, Notification, constantService, predictionsService, $routeParams){
    $rootScope.isLogged();
    constantService.then(function(data) {
        $scope.nationalities = data.nationalities;
        const user = $routeParams.login;
        predictionsService.getUserPredictions(user).then(function (predictions) {
            $scope.predictions = predictions;
            $scope.groups = [];
            $scope.cupStage = [];
            $scope.user = $routeParams.login;
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

        });
    });
});