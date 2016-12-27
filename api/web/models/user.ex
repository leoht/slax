defmodule Slax.User do
  use Slax.Web, :model
  @derive {Poison.Encoder, only: [:email, :first_name, :last_name, :api_token]}

  schema "users" do
    field :email, :string
    field :password, :string
    field :salt, :string
    field :first_name, :string
    field :last_name, :string
    field :api_token, :string

    timestamps()
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
    |> put_change(:api_token, "test")
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
