defmodule Slax.Helpers.AuthHelper do
  import Plug.Conn
  alias Slax.User
  
  def ensure_token(conn, _) do
    token = case get_req_header(conn, "authorization") do
      [t] -> t
      [] -> nil
    end
    
    case User.authenticate_by_token(token) do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> Phoenix.Controller.json %{error: "Invalid authentication token"}
      user -> 
        assign(conn, :user, user)
    end
  end
end
