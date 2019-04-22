app.controller('allPredictionsCtrl', function($rootScope, $scope, $http, Notification, constantService, predictionsService) {
    $http.post('/predictions/allPredictions', {}).then(function (response) {
        $scope.predictions = response.data;
        $scope.index = 1;
        $scope.winners = [];
        angular.forEach($scope.predictions, function (value) {
            value.index = $scope.index++;
            if(value.final[0][0].win){
                $scope.winners.push(value.final[0][0]);
            }
            else {
                $scope.winners.push(value.final[0][1]);
            }
        });
        $scope.predictions.sort(function (a, b) {
            return (b.groupPoints + b.cupPoints) - (a.groupPoints + a.cupPoints);
        });
    });
});