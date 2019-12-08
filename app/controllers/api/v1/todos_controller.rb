class Api::V1::TodosController < Api::V1::SecuredController

  before_action :set_todo, only: [:show, :update, :destroy]

  def index
    @todos = current_user.todos
  end

  def show
  end

  def update
    @todo.update! todo_params
  end

  def create
    @todo = Todo.create! todo_params.merge(user_id: current_user.id)
  end

  def destroy
    @todo.destroy!
  end

  private

  def set_todo
    @todo = Todo.where(user_id: params[:user_id], id: params[:id]).first!
  end

  def todo_params
    params.require(:todo).permit(:id, :user_id, :name, :completed)
  end

end
