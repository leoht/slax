app.factory("auth", ["$http", function ($http) {
  return {
    setUser: function (user) {
      localStorage.user = JSON.stringify(user)
      $http.defaults.headers.common['Authorization'] = user.api_token;
    },
    getUser: function () {
      if (localStorage.user != null) {
        return JSON.parse(localStorage.user);
      }
      
      return null;
    }
  };
}]);
