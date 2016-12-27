defmodule Slax.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :password, :string
      add :salt, :string
      add :first_name, :string
      add :last_name, :string
      add :api_token, :string

      timestamps()
    end
    create unique_index(:users, [:email])

  end
end
