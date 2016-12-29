app.controller("HomeController", [
  "$scope",
  "usersApi",
  "auth",
  "$location",
  function ($scope, usersApi, auth, $location) {
    $scope.login = function () {
      usersApi.authenticate($scope.auth)
        .then(function success(response) {
          auth.setUser(response.data);
          $location.path("/profile");
        }, function failure(response) {
          $scope.loginError = "Invalid credentials";
        });
    };
    
    $scope.register = function () {
      usersApi.create($scope.registration)
        .then(function success(response) {
          auth.setUser(response.data);
          $location.path("/profile");
        }, function failure(response) {
          $scope.signupError = "Error creating your account!";
        });
    };
  }
]);
