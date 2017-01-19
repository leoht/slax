app.controller("ProfileController", [
  "$scope",
  "usersApi",
  "friendshipsApi",
  "auth",
  "socket",
  function ($scope, usersApi, friendshipsApi, auth, socket) {
    $scope.user = auth.getUser();
    if ($scope.user) {
      usersApi.get($scope.user.id)
        .then(function success(response) {
          $scope.user = response.data;
        }, function failure(response) {
          $scope.error = "Oops, there was some error retrieving your profile!";
        });
        
      socket.connect(function (res) {
        console.log("Joined", res)
      })
    }
    
    $scope.update = function () {
      usersApi.update($scope.user.id, {
        user: $scope.user
      }).then(function success(response) {
        $scope.updated = true;
      }, function failure(response) {
        $scope.error = "Oops, there was some error updating your profile!";
      });
    };
  }
]);
