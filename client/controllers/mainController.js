app.controller('mainCtrl', function($rootScope, $scope, $http, Notification, $cookies, moment){
    $scope.wrongActivateToken = function() {
        const cookie = $cookies.get('wrongAccToken');
        if(cookie) {
            $cookies.remove('wrongAccToken');
            Notification.error({message: 'Nieprawidłowy link aktywacyjny.', delay: 5000});
        }
    };
    $scope.wrongResetToken = function() {
        const cookie = $cookies.get('wrongResetToken');
        if(cookie) {
            $cookies.remove('wrongResetToken');
            Notification.error({message: 'Nieprawidłowy link do zresetowania hasła.', delay: 5000});
        }
    };

    $scope.wrongActivateToken();
    $scope.wrongResetToken();

    $http.get('/predictions/topLists',{}).then(function (response) {
        $scope.last5predictions = response.data.lastUsers;
        $scope.topWinners = response.data.topWinners;
        angular.forEach($scope.last5predictions, function (value) {
            value.creationDate = moment(value.creationDate).format('LLL');
        });
    });
});