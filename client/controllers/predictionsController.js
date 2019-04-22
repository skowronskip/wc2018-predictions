app.controller('predictionsCtrl', function($rootScope, $scope, $http, $location, predictionsService) {
    predictionsService.getMyPredictions().then(function (predictions) {
        $location.path('/myPredictions');
    }).catch(function () {
        $location.path('/createPredictions');
    });
});