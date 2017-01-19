app.factory("friendshipsApi", ["$http", "config",
  function ($http, config) {
    return {
      all: function () {
        return $http.get(config.apiBaseUrl + "/friendships");
      },
      pending: function () {
        return $http.get(config.apiBaseUrl + "/friendships/pending");
      },
      create: function (targetUserId) {
        return $http.post(config.apiBaseUrl + "/friendships", {
          user_id: targetUserId
        });
      },
      accept: function (id) {
        return $http.put(config.apiBaseUrl + "/friendships/" + id + "/accept")
      }
    }
  }
]);
