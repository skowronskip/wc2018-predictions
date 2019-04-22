app.controller('registerCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location){
    $scope.firstname = '';
    $scope.surname = '';
    $scope.email = '';
    $scope.login = '';
    $scope.password = '';
    $scope.rpassword = '';
    $scope.policy = false;
    $scope.validateFirstname = false;
    $scope.validateSurname = false;
    $scope.validatePassword = false;
    $scope.validatePassword2 = false;
    $scope.validateRpassword = false;
    $scope.validateEmail = false;
    $scope.validateLogin = false;

    $scope.samePassword = function () {
        return $scope.password !== $scope.rpassword;
    };

    $scope.submit = function() {
        if(!$scope.samePassword() && !$scope.validateLogin && !$scope.validatePassword && !$scope.validatePassword2 && !$scope.validateEmail && !$scope.validateRpassword && !$scope.validateFirstname && !$scope.validateSurname && $scope.policy){
            $http.post('/register', {"login": $scope.login,
                                        "password": $scope.password,
                                        "firstname": $scope.firstname,
                                        "surname": $scope.surname,
                                        "mail": $scope.mail,
            "creationDate": moment().toDate()}).then(function (response) {
                $location.path('/');
                Notification.success({message: 'Na swój adres e-mail otrzymałeś/aś link aktywacyjny swojego konta. Po aktywowaniu konta, będziesz mógł/a zalogować się.', delay: 5000});
            })
                .catch(function (err) {
                    Notification.error({message: err.data, delay: 5000});
                });
        }

    }
});