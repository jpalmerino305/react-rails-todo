json.todos @todos do |todo|

  json.partial! "api/v1/todos/todo", todo: todo

end