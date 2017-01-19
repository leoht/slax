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
