app.factory('predictionsService', function($http, $sessionStorage, Notification, $location) {
    return {
        getMyPredictions : function () {
            return $http.post('/predictions/myPredictions', {_id: $sessionStorage.get('auth')}).then(function (response) {
                return response.data;
            });
        },
        getUserPredictions : function (user) {
            return $http.post('/predictions/userPredictions', {login: user}).then(function (response) {

                return response.data;
            }).catch(function (err) {
                Notification.error({message: err.data, delay: 5000});
                $location.path('/');
        });
        },
        getGroupResults : function () {
            return $http.get('/predictions/currentGroupStandings', {}).then(function (response) {
                return response.data
            });
        }
    }
});