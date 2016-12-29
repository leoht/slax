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

app.controller("ProfileController", [
  "$scope",
  "usersApi",
  "auth",
  function ($scope, usersApi, auth) {
    $scope.user = auth.getUser();
    if ($scope.user) {
      usersApi.get($scope.user.id)
        .then(function success(response) {
          $scope.user = response.data;
        }, function failure(response) {
          $scope.error = "Oops, there was some error retrieving your profile!";
        });
       
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
  }
]);

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
        console.log(updates);
        return $http.put(config.apiBaseUrl + "/users/" + userId, updates); 
      }
   }
}]);
