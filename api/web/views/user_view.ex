defmodule Slax.UserView do
  use Slax.Web, :view
  
  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      email: user.email,
      api_token: user.api_token,
      first_name: user.first_name,
      last_name: user.last_name,
      inserted_at: user.inserted_at
    }
  end
  
  def render("public_user.json", %{user: user}) do
    %{
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      inserted_at: user.inserted_at
    }
  end
end
