class Api::V1::UsersController < Api::V1::SecuredController

  protect_from_forgery with: :exception, unless: -> { request.format.json? }

  rescue_from ActiveRecord::RecordInvalid do |exception|
    render json: { message: "Record Invalid", errors: exception.record.errors.full_messages, fields_with_errors: exception.record.errors }, status: :unprocessable_entity
  end

  rescue_from NotImplementedError do |exception|
    render json: { message: exception.to_s }, status: :unprocessable_entity
  end

  rescue_from Exceptions::InvalidApiParameterError do |exception|
    render json: { message: exception.to_s }, status: :unprocessable_entity
  end

  def update_profile
    update_type = params[:update_type]

    if update_type == "email"
      email = user_params.fetch(:email, "")
      email_confirmation = user_params.fetch(:email_confirmation, "")
      password = user_params.fetch(:password, "")

      puts "email = #{email}"
      puts "email_confirmation = #{email_confirmation}"
      puts "password = #{password}"

      raise Exceptions::InvalidApiParameterError.new "Email and email confirmation are required" and return if email.blank? || email_confirmation.blank?
      raise Exceptions::InvalidApiParameterError.new "Email and email confirmation must match" and return if email.downcase != email_confirmation.downcase
      raise Exceptions::InvalidApiParameterError.new "Invalid password" and return unless current_user.valid_password?(password)

      current_user.email = email
      current_user.save!

    elsif update_type == "password"
      current_user.update_with_password user_params.slice(:password, :current_password, :password_confirmation)
      raise ActiveRecord::RecordInvalid.new current_user and return
    else
      raise NotImplementedError.new and return
    end

    render json: { user: current_user.as_json(only: [:id, :email]) }
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :current_password, :password_confirmation, :email, :email_confirmation)
  end

end
