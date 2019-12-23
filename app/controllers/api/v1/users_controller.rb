class Api::V1::UsersController < Api::V1::SecuredController

  protect_from_forgery with: :exception, unless: -> { request.format.json? }

  rescue_from ActiveRecord::RecordInvalid do |exception|
    render json: { message: "Record Invalid", errors: exception.record.errors.full_messages, fields_with_errors: exception.record.errors }, status: :unprocessable_entity
  end

  rescue_from NotImplementedError do |exception|
    render json: { message: exception.to_s }, status: :unprocessable_entity
  end


  def update_profile
    update_type = params[:update_type]

    token = nil

    if update_type == "email"
      updated = current_user.update_with_password user_params.slice(:email, :current_password)
      raise ActiveRecord::RecordInvalid.new current_user and return unless updated
      token = Utils::JasonWebToken.encode({ email: current_user.email, api_authentication_token: current_user.api_authentication_token })
    elsif update_type == "password"
      updated = current_user.update_with_password user_params.slice(:password, :current_password, :password_confirmation)
      raise ActiveRecord::RecordInvalid.new current_user and return unless updated
    else
      raise NotImplementedError.new and return
    end

    render json: { user: current_user.as_json(only: [:id, :email]), access_token: token }
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :current_password, :password_confirmation, :email)
  end

end
