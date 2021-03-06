# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.find_or_initialize_by(email: "jp.almerino305@gmail.com")
user.password = "1234567890"
user.todos << Todo.find_or_initialize_by(name: "Hit the gym")
user.todos << Todo.find_or_initialize_by(name: "Buy snacks")
user.todos << Todo.find_or_initialize_by(name: "Bike")
user.todos << Todo.find_or_initialize_by(name: "Hike")
user.todos << Todo.find_or_initialize_by(name: "Swim")
user.save!