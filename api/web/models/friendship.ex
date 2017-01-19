defmodule Slax.Friendship do
  use Slax.Web, :model

  schema "friendships" do
    field :active, :boolean, default: false
    belongs_to :source_user, Slax.User
    belongs_to :target_user, Slax.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:active, :source_user_id, :target_user_id])
    |> validate_required([:active])
  end
  
  def create(source_user, target_user) do
    changeset(%Slax.Friendship{}, %{
      source_user_id: source_user.id,
      target_user_id: target_user.id
    }) |> Slax.Repo.insert()
  end
  
  def accept(friendship_id) do
    case Slax.Repo.get_by(Slax.Friendship, %{ id: friendship_id, active: false }) do
      nil -> {:error, :not_found}
      friendship ->
        friendship
        |> Slax.Friendship.changeset(%{ active: true })
        |> Slax.Repo.update()
    end
  end

  def friendships_of(user) do
    query = from f in Slax.Friendship,
      join: target_user in assoc(f, :target_user),
      join: source_user in assoc(f, :source_user),
      where: target_user.id == ^user.id or source_user.id == ^user.id,
      where: f.active == true

    Slax.Repo.all(query) |> Slax.Repo.preload([:source_user, :target_user])
  end
  
  def pending_friendships_of(user) do
    query = from f in Slax.Friendship,
      join: target_user in assoc(f, :target_user),
      join: source_user in assoc(f, :source_user),
      where: target_user.id == ^user.id and f.active == false

    Slax.Repo.all(query) |> Slax.Repo.preload([:source_user, :target_user])
  end
  
  def friends_of(user) do
    user = Slax.Repo.preload(user, [:friends_as_source, :friends_as_target])
    (user.friends_as_target ++ user.friends_as_source)
  end
end
