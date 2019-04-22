app.controller('resultsCtrl', function($rootScope, $scope, $http, Notification, constantService, predictionsService, $routeParams){
    $rootScope.isLogged();
    constantService.then(function(data) {
        $scope.nationalities = data.nationalities;
        predictionsService.getGroupResults().then(function (results) {
           $scope.results = results;
           console.log($scope.results);
           $scope.nationalities = _.map($scope.nationalities, function (group) {
             var done = _.map(group.group, function (team) {
                 var place = _.find($scope.results, function (resultTeam) {
                     return resultTeam.code === team.code;
                 });
                  team.place = place.place;
                  return team;
                  });
             return done;
           });
           console.log($scope.nationalities);
        });
    });
});