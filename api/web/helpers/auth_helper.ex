defmodule Slax.Helpers.AuthHelper do
  import Plug.Conn
  alias Slax.User
  
  def ensure_token(conn, _) do
    token = conn.req_headers[:authorization]
    user = User.authenticate_by_token(token)
    case user do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> Phoenix.Controller.json %{error: "Invalid authentication token"}
      _ -> 
        assign(conn, :user, user)
    end
  end
end
