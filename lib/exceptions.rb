module Exceptions
  class HeaderRequiredError < StandardError; end
  class Unauthorized < StandardError; end
  class InvalidAccessTokenError < StandardError; end
end