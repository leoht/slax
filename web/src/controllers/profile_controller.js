app.controller("ProfileController", [
  "$scope",
  "usersApi",
  "auth",
  function ($scope, usersApi, auth) {
    $scope.user = auth.getUser();
    
    if ($scope.user) {
      usersApi.get($scope.user.id)
        .then(function (response) {
          $scope.user = response.data;
        });
        
      $scope.update = function () {
        usersApi.update($scope.user.id, {
          user: $scope.user
        }).then(function (response) {
            $scope.updated = true;
          });
      };
    }
  }
]);
