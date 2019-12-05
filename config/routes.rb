Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :sessions, only: [:index, :create]
    end
  end

  root to: 'todo_app#index'

  get '*path', to: 'todo_app#index'

end
