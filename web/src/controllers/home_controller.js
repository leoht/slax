app.controller("HomeController", [
  "$scope",
  "usersApi",
  "auth",
  "$location",
  function ($scope, usersApi, auth, $location) {
    $scope.login = function () {
      usersApi.authenticate($scope.auth)
        .then(function (response) {
          auth.setUser(response.data);
          $location.path("/profile");
        });
    };
    
    $scope.register = function () {
      usersApi.create($scope.registration)
        .then(function (response) {
          console.log(response);
          auth.setUser(response.data);
          $location.path("/profile");
        });
    };
  }
]);
