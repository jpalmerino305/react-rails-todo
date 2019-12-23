module Exceptions
  class HeaderRequiredError < StandardError; end
  class Unauthorized < StandardError; end
  class InvalidAccessTokenError < StandardError; end
  class InvalidApiParameterError < StandardError; end
end