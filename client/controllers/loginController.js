app.controller('loginCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location, $sessionStorage){
    $scope.login = 'login';
    $scope.password = 'password';
    $scope.validateLogin = false;
    $scope.validatePassword = false;

    $scope.isAccActivate = function() {
        const cookie = $cookies.get('accActivated');
        if(cookie) {
            $cookies.remove('accActivated');
            Notification.success({message: 'Konto zostalo aktywowane. Teraz możesz spokojnie się zalogować.', delay: 5000});
        }
    };
    $scope.isAccActivate();

    $scope.submit = function() {
        if(!$scope.validateLogin && !$scope.validatePassword){
            $http.post('/login', {"login": $scope.login, "password": $scope.password}).then(function (response) {
                $sessionStorage.put('auth', response.data._id);
                Notification.success({message: 'Zostałeś zalogowany.', delay: 5000});
                $rootScope.loadUser();
                $location.path('/');
            })
                .catch(function (err) {
                    Notification.error({message: err.data, delay: 5000});
                });
        }
    }
});