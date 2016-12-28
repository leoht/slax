var app = angular.module('slax', [
  'ngRoute'
]);

app.config(["$routeProvider", function ($routeProvider) {
  $routeProvider
    .when("/", {controller: "HomeController", templateUrl: "views/home.html"})
    .when("/profile", {controller: "ProfileController", templateUrl: "views/profile.html"});
}]);

app.run([
  "$http",
  "auth",
  "$rootScope",
  "$location",
  function ($http, auth, $rootScope, $location) {
    var user = auth.getUser();
    if (user) {
      $http.defaults.headers.common['Authorization'] = user.api_token;
    }
    
    $rootScope.$on(
      "$routeChangeStart",
      function (event, next, current) {
        if (!auth.getUser() && next.controller != "HomeController") {
          $location.path("/");
        }
    });
  }
]);

app.value("config", {
  apiBaseUrl: "http://192.168.99.100:4000/api"
});
