defmodule Slax.Router do
  use Slax.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Slax do
    pipe_through :api
    
    post "/users/authenticate", UserController, :authenticate
    resources "/users", UserController, except: [:new, :edit]
    
    ###
    # FRIENDSHIPS
    ###
    get "/friendships/pending", FriendshipController, :pending
    
    resources "/friendships", FriendshipController, except: [:new, :edit] do
      put "/accept", FriendshipController, :accept
    end
  end
end
