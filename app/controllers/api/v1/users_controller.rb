class Api::V1::UsersController < Api::V1::SecuredController

  protect_from_forgery with: :exception, unless: -> { request.format.json? }

  rescue_from ActiveRecord::RecordInvalid do |exception|
    render json: { message: "Record Invalid", errors: exception.record.errors.full_messages, fields_with_errors: exception.record.errors }, status: :unprocessable_entity
  end

  rescue_from NotImplementedError do |exception|
    render json: { message: exception.to_s }, status: :unprocessable_entity
  end

  def profile
    update_type = params[:update_type]



    if update_type == "email"
    elsif update_type == "password"
      current_user.update_with_password user_params.slice(:password, :current_password, :password_confirmation)
      raise ActiveRecord::RecordInvalid.new current_user and return
    else
      raise NotImplementedError.new and return
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :current_password, :password_confirmation)
  end

end
