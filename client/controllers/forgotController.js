app.controller('forgotCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location){
    $scope.mail = '';
    $scope.validateMail = false;

    $scope.submit = function() {
        if(!$scope.validateMail){
            $http.post('/forgotPass', {"mail": $scope.mail}).then(function (response) {
                Notification.success({message: 'Link resetujący hasło został wysłany na podany adres e-mail.', delay: 5000});
                $location.path('/');
            })
                .catch(function (err) {

                    Notification.error({message: err.data, delay: 5000});
                });
        }
    }
});