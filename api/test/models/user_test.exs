defmodule Slax.UserTest do
  use Slax.ModelCase

  alias Slax.User

  @valid_attrs %{api_token: "some content", email: "some content", first_name: "some content", last_name: "some content", password: "some content", salt: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
