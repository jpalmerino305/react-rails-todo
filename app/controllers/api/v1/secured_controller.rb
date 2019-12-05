class Api::V1::SecuredController < ApplicationController

  protect_from_forgery with: :exception, unless: -> { request.format.json? }

  before_action :authenticate_request!

  protected

  def authenticate_request!
    warden.authenticate!(:api_access_token)
  end

end