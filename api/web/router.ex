defmodule Slax.Router do
  use Slax.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Slax do
    pipe_through :api
    
    post "/users/authenticate", UserController, :authenticate
    resources "/users", UserController, except: [:new, :edit]
  end
end
