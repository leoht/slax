defmodule Slax.UserController do
  use Slax.Web, :controller
  alias Slax.User
  
  # plug :ensure_token
  
  def index(conn, _params) do
    json conn, %{message: "ok"}
  end
  
  def create(conn, %{"user" => user_params}) do
    case User.create(user_params) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> render "user.json", user: user
      {:error, changeset} ->
        json conn, %{error: "error creating user"}
    end
  end
  
  def authenticate(conn, %{"email" => email, "password" => password}) do
    case User.authenticate(email, password) do
      {:ok, user} ->
        conn
        |> render "user.json", user: user
      {:error, _} ->
        conn
        |> put_status(:not_found)
        |> json %{error: "Invalid credentials"}
    end
  end
end
