defmodule Slax.Repo.Migrations.CreateFriendship do
  use Ecto.Migration

  def change do
    create table(:friendships) do
      add :active, :boolean, default: false, null: false
      add :source_user_id, references(:users, on_delete: :nothing)
      add :target_user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:friendships, [:source_user_id])
    create index(:friendships, [:target_user_id])
    create unique_index(:friendships, [:source_user_id, :target_user_id])
  end
end
