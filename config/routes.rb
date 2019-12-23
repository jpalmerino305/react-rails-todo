Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :registrations, only: [:create]
      resources :sessions, only: [:index, :create]
      resources :users do
        resources :todos
        collection do
          put :update_profile
        end
      end
    end
  end

  root to: 'todo_app#index'

  get '*path', to: 'todo_app#index'

end
