class CreateTodos < ActiveRecord::Migration[6.0]
  def change
    create_table :todos do |t|
      t.integer :user_id
      t.string :name
      t.boolean :completed, default: false
      t.timestamps
    end
  end
end
