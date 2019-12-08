require 'jwt'

module Utils

  class JasonWebToken

    def self.encode(data, expiration = 30.days.from_now.to_i)
      data[:exp] = expiration
      JWT.encode data, secret, "HS256"
    end

    def self.decode(token)
      decoded = JWT.decode token, secret, true, { algorithm: "HS256" }
      ActiveSupport::HashWithIndifferentAccess.new(decoded[0])
    end

    def self.secret
      Rails.application.credentials[Rails.env.to_sym][:secret_key_base]
    end

  end

end