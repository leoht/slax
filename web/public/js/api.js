var Api = (function () {
  
  var baseUrl = "http://192.168.99.100:4000/api";
  
  function makeRequest(method, path, params) {
    return new Promise(function (fulfill, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, baseUrl + path, true);

      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          fulfill(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.response)
        }
      };
      
      xhr.send(JSON.stringify(params));
    });
  }
  
  return {
    Users: {
      create: function (params) {
        return makeRequest("POST", "/users", {})
      },
      authenticate: function (email, password) {
        return makeRequest("POST", "/users/authenticate", {
          email: email,
          password: password
        })
      }
    }
  };
}) ();
