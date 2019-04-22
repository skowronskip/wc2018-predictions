var app = angular.module('TyperMS', ['ngRoute', 'ui-notification', 'ngCookies', 'ngSessionStorage', 'ngclipboard']);
app.run(function ($rootScope, $cookies, $location, Notification, $http, $sessionStorage, $interval) {
    moment.locale('pl');
    $rootScope.testvariable = 'No witam Cie z rootscope';
    $rootScope.loggedUser = {};
    $rootScope.hostname = 'wc2018.pskowron.ski';
    $rootScope.isLogged = function () {
        const logged = $sessionStorage.get('auth');
        if (logged) {
            if ($location.url() === '/login' || $location.url() === '/register' || $location.url() === '/forgot') {
                $location.path('/');
            }
            return true;
        }
        else if($location.url() === '/createPredictions'){
            $location.path('/');
        }
        return false;
    };

    $rootScope.loadUser = function () {
        const logged = $sessionStorage.get('auth');
        if (logged) {
            $http.post('/findUser', {_id: logged}).then(function (response) {
                $rootScope.loggedUser = response.data;
                return true;
            });
        }
        return false;
    };

    if ($sessionStorage.get('auth')) {
        $rootScope.loadUser();
    }

    $rootScope.logout = function () {
        const logged = $sessionStorage.get('auth');
        if (logged) {
            $sessionStorage.remove('auth');
            $rootScope.loggedUser = {};
            $location.path('/');
            Notification.success({message: 'Zostałeś wylogowany', delay: 5000});
        }
    };

    $rootScope.timeNow = function() {
        return new moment().format("dddd, DD/MMMM/YYYY, LTS");
    };

    var stopTime = $interval($rootScope.timeNow, 1000);

    $rootScope.timeToWorldCupDays = function () {
        var now = new moment();
        var wc = new moment("20180614, 17:00:00", "YYYYMMDD, LTS");
        return moment.duration(wc.diff(now)).days();
    };

    $rootScope.timeToWorldCupHours = function () {
        var now = new moment();
        var wc = new moment("20180614, 17:00:00", "YYYYMMDD, LTS");
        return moment.duration(wc.diff(now)).hours();
    };

    $rootScope.timeToWorldCupMinutes = function () {
        var now = new moment();
        var wc = new moment("20180614, 17:00:00", "YYYYMMDD, LTS");
        return moment.duration(wc.diff(now)).minutes();
    };

    $rootScope.timeToWorldCupSeconds = function () {
        var now = new moment();
        var wc = new moment("20180614, 17:00:00", "YYYYMMDD, LTS");
        return moment.duration(wc.diff(now)).seconds();
    };


});

app.constant("moment", moment);
