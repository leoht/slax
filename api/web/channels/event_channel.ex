defmodule Slax.EventChannel do
  use Phoenix.Channel
  
  def join("events:" <> user_id, _params, socket) do
    {user_id, _} = Integer.parse(user_id)
    authenticated_user_id = socket.assigns[:user_id]
    case authenticated_user_id == user_id do
      true -> {:ok, socket}
      false -> {:error, authenticated_user_id}
    end
  end
  
  def handle_in("friend_request", %{
    "friendship_id" => friendship_id,
    "target_user_id" => target_user_id,
    "source_user_id" => source_user_id
  }, socket) do
      
    Slax.Endpoint.broadcast(
      "events:#{target_user_id}",
      "friend_request",
      %{friendship_id: friendship_id, source_user_id: source_user_id}
    )
  end
end
