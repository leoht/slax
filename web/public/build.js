var app = angular.module('slax', [
  'ngRoute'
]);

app.config(["$routeProvider", function ($routeProvider) {
  $routeProvider
    .when("/", {controller: "HomeController", templateUrl: "views/home.html"})
    .when("/profile", {controller: "ProfileController", templateUrl: "views/profile.html"})
    .when("/search", {controller: "SearchController", templateUrl: "views/search.html"});
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
  apiBaseUrl: "http://192.168.99.100:4000/api",
  socketBaseUrl: "ws://192.168.99.100:4000/socket"
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

app.factory("socket", ["config", "auth",
  function (config, auth) {
    var socket = null;
    var eventsChannel = null;
    
    return {
      connect: function (success, failure) {
        user = auth.getUser();
        
        if (user) {
          socket = new Socket(config.socketBaseUrl, {
            params: {
              token: user.api_token
            }
          });
          
          socket.connect();
          
          eventsChannel = socket.channel("events:" + user.id);
          eventsChannel.join()
            .receive("ok", success)
            .receive("error", failure);
          
        }
      }
    }
  }
]);

app.factory("usersApi", ["$http", "config",
  function ($http, config) {
    return {
      all: function () {
        return $http.get(config.apiBaseUrl + "/users")
      },
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
