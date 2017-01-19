app.controller("PendingFriendshipsController", [
  "$scope",
  "friendshipsApi",
  function ($scope, friendshipsApi) {
    friendshipsApi.pending()
      .then(function success(response) {
        $scope.pendingFriendships = response.data;
      }, function failure(response) {
        $scope.error = "Oops, some error occured!";
      });
      
    $scope.acceptFriendship = function ($event, friendshipId) {
      friendshipsApi.accept(friendshipId)
        .then(function success(response) {
          angular.element($event.target).parent().remove();
          $scope.pendingFriendships = $scope.pendingFriendships.filter(function (f) {
            return f.id != friendshipId;
          });
        }, function failure(response) {
          $scope.error = "Oops, there was some error!";
        });
    };
  }
]);
