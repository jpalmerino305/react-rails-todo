class AddApiAuthenticationTokenToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :api_authentication_token, :string
  end
end
