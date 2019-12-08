class Api::V1::SecuredController < ApplicationController

  before_action :skip_trackable
  before_action :authenticate_request!


  protect_from_forgery with: :exception, unless: -> { request.format.json? }


  rescue_from Exceptions::Unauthorized do |exception|
    render json: { message: exception.to_s }, status: :unauthorized
  end

  rescue_from Exceptions::HeaderRequiredError do |exception|
    render json: { message: exception.to_s }, status: :unauthorized
  end

  rescue_from JWT::DecodeError do |exception|
    render json: { message: "Invalid access_token" }, status: :unauthorized
  end


  protected

  # def authenticate_request!
  #   warden.authenticate!(:api_access_token)
  # end

  def authenticate_request!
    access_token = request.headers["AUTHORIZATION"].to_s.remove('Bearer ')

    raise Exceptions::HeaderRequiredError.new "Missing access_token" and return if access_token.blank?

    decoded = Utils::JasonWebToken.decode(access_token)

    email = decoded[:email]
    api_authentication_token = decoded[:api_authentication_token]

    user = User.where(email: email, api_authentication_token: api_authentication_token).first!

    sign_in user, store: false
  end

  def skip_trackable
    request.env['devise.skip_trackable'] = true
  end

end