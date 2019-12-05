class Api::V1::SessionsController < ApplicationController

  protect_from_forgery with: :exception, unless: -> { request.format.json? }

  rescue_from Exceptions::Unauthorized do |exception|
    render json: { message: exception.to_s }, status: :unauthorized
  end

  rescue_from Exceptions::InvalidAccessTokenError do |exception|
    render json: { message: exception.to_s }, status: :bad_request
  end

  rescue_from JWT::DecodeError do |exception|
    render json: { message: "Invalid Access Token" }, status: :bad_request
  end

  def index
    access_type = params.fetch(:access_type, "")

    if access_type.present? && access_type.downcase == "verify"
      access_token = params.fetch(:access_token, "")

      raise Exceptions::Unauthorized.new "Unauthorized" if access_token.blank?

      decoded = Utils::JasonWebToken.decode(access_token)

      email = decoded[:email]
      api_authentication_token = decoded[:api_authentication_token]

      user = User.where(email: email, api_authentication_token: api_authentication_token).first!

      render json: { user: user.as_json(only: [:email]) } and return
    end

    head :no_content
  end

  def create
    user = User.find_by(email: params[:email])
    if user&.valid_password?(params[:password])
      token = Utils::JasonWebToken.encode({ email: user.email, api_authentication_token: user.api_authentication_token })
      render json: { access_token: token }, status: :created
    else
      render json: { message: "Unauthorized" }, status: :unauthorized
    end
  end

end
