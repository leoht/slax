app.controller("SearchController", [
  "$scope",
  "usersApi",
  "friendshipsApi",
  function ($scope, usersApi, friendshipsApi) {
    usersApi.all()
      .then(function success(response) {
        $scope.users = response.data
      }, function failure(response) {
        $scope.error = true
      });
      
    $scope.requestFriendship = function ($event, userId) {
      friendshipsApi.create(userId)
        .then(function success(response) {
          angular.element($event.target).parent().remove();
        }, function failure(response) {
          $scope.error = true;
        })
    };
  }
]);
