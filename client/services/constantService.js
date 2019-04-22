app.factory('constantService', function($http) {
    return $http.get('../constants.json').then(function(response) {
        return response.data;
    });
});