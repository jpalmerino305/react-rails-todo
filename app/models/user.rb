class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  before_create :set_api_authentication_token

  def set_api_authentication_token
    self.api_authentication_token = SecureRandom.uuid
  end

end
