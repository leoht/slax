app.factory("usersApi", ["$http", "config",
  function ($http, config) {
    return {
      create: function (params) {
        return $http.post(config.apiBaseUrl + "/users", { user: params });
      },
      authenticate: function (params) {
        return $http.post(config.apiBaseUrl + "/users/authenticate", params);
      },
      get: function (userId) {
        return $http.get(config.apiBaseUrl + "/users/" + userId);
      },
      update: function (userId, updates) {
        return $http.put(config.apiBaseUrl + "/users/" + userId, updates); 
      }
   }
}]);
