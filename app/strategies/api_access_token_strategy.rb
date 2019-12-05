class ApiAccessTokenStrategy < Warden::Strategies::Base

  def valid?
    user_details[:email].present? && user_details[:api_authentication_token].present?
  end

  def authenticate!
    email = user_details.fetch(:email, "")
    api_authentication_token = user_details.fetch(:api_authentication_token, "")

    user = User.where(email: email, api_authentication_token: api_authentication_token).first

    if user
      success!(user)
    else
      fail!('Invalid email or password')
    end
  end

  private

  def user_details
    access_token = env['HTTP_AUTHORIZATION'].to_s.remove('Bearer ')

    decoded = Utils::JasonWebToken.decode(access_token)

    email = decoded[:email]
    api_authentication_token = decoded[:api_authentication_token]

    { email: email, api_authentication_token: api_authentication_token }
  rescue
    {}
  end

end