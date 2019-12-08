class Api::V1::RegistrationsController < ApplicationController

  protect_from_forgery with: :exception, unless: -> { request.format.json? }

  rescue_from ActiveRecord::RecordInvalid do |exception|
    render json: { message: exception.to_s }, status: :bad_request
  end

  def create
    user = User.create! user_params
    token = Utils::JasonWebToken.encode({ email: user.email, api_authentication_token: user.api_authentication_token })
    render json: { access_token: token, user: user_details_response(user) }, status: :created
  end

  private

  def user_details_response user
    user.as_json(only: [:id, :email])
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

end
