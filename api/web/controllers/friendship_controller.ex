defmodule Slax.FriendshipController do
  use Slax.Web, :controller
  
  plug :ensure_token
  plug :find_other_user when action in [:create]
  
  def index(conn, _params) do
    conn |> render("friendships.json", %{
      friendships: Slax.Friendship.friendships_of(
        conn.assigns[:user]
      )
    })
  end
  
  def pending(conn, _params) do
    conn |> render("friendships.json", %{
      friendships: Slax.Friendship.pending_friendships_of(
        conn.assigns[:user]
      )
    })
  end
  
  def create(conn, _params) do
    case Slax.Friendship.create(
      conn.assigns[:user],
      conn.assigns[:other_user]
    ) do
      {:ok, friendship} ->
        friendship = friendship |> Slax.Repo.preload([:source_user, :target_user])
        conn
        |> put_status(:created)
        |> render("friendship.json", %{friendship: friendship})
      {:error, changeset} -> 
        conn
        |> put_status(:bad_request)
        |> json(%{error: "error creating friendship"})
    end
  end
  
  def accept(conn, %{"friendship_id" => id}) do
    case Slax.Friendship.accept(id) do
      {:error, :not_found} ->
        conn |> put_status(:not_found) |> json(%{error: "not found"})
      {:error, changeset} ->
        conn |> put_status(:bad_request) |> json(%{error: "error accepting friendship"})
      {:ok, friendship} ->
        conn |> render("friendship.json", %{
          friendship: friendship |> Slax.Repo.preload([:source_user, :target_user])
        })
    end
  end
  
  defp find_other_user(conn, params) do
    case Slax.Repo.get(Slax.User, conn.params["user_id"]) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "User not found"})
      user ->
        conn
        |> assign(:other_user, user)
    end
  end
end
