use Mix.Config

config :slax, Slax.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "slax_dev",
  hostname: "localhost",
  pool_size: 10
