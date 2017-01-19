defmodule Slax.FriendshipView do
  use Slax.Web, :view
  
  def render("friendship.json", %{friendship: friendship}) do
    %{
      id: friendship.id,
      source_user: render(Slax.UserView, "public_user.json", %{user: friendship.source_user}),
      target_user: render(Slax.UserView, "public_user.json", %{user: friendship.target_user}),
      active: friendship.active
    }
  end
  
  def render("friendships.json", %{friendships: friendships}) do
    render_many(friendships, __MODULE__, "friendship.json")
  end
end
