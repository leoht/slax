defmodule Slax.User do
  use Slax.Web, :model

  schema "users" do
    field :email, :string
    field :password, :string
    field :salt, :string
    field :first_name, :string
    field :last_name, :string
    field :api_token, :string

    timestamps()
    
    has_many :outcoming_friendships, Slax.Friendship, foreign_key: :source_user_id
    has_many :incoming_friendships, Slax.Friendship, foreign_key: :target_user_id
    has_many :friends_as_source, through: [:outcoming_friendships, :target_user]
    has_many :friends_as_target, through: [:incoming_friendships, :source_user] 
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:email, :password, :salt, :first_name, :last_name, :api_token])
    |> validate_required([:email, :password, :first_name, :last_name])
    |> unique_constraint(:email)
  end
  
  def create(params) do
    changeset(%Slax.User{}, params)
    |> put_change(:password, hashed_password(params["password"]))
    |> put_change(:api_token, :base64.encode(:crypto.strong_rand_bytes(24)))
    |> Slax.Repo.insert()
  end
  
  def authenticate(email, password) do
    user =  Slax.Repo.get_by(Slax.User, email: email)
    case check_password(user, password) do
      true -> {:ok, user}
      _    -> {:error, "not found"}
    end
  end
  
  def authenticate_by_token(token) do
    case token do
      nil -> nil
      _ -> Slax.Repo.get_by(Slax.User, api_token: token)
    end
  end
  
  defp check_password(user, password) do
    case user do
      nil -> false
      _ -> Comeonin.Pbkdf2.checkpw(password, user.password)
    end
  end
  
  defp hashed_password(password) do
    Comeonin.Pbkdf2.hashpwsalt(password)
  end
end
