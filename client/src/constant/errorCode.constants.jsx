export const apiErrorMessages = {
  NOT_FOUND: {
      message: "The requested data was not found.",
      code: "ERR404"
  },
  UNAUTHORIZED: {
      message: "You are not authorized to access this resource.",
      code: "ERR401"
  },
  FORBIDDEN: {
      message: "Access to this resource is forbidden.",
      code: "ERR403"
  },
  BAD_REQUEST: {
      message: "The request could not be understood by the server due to malformed syntax.",
      code: "ERR400"
  },
  SERVER_ERROR: {
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request.",
      code: "ERR500"
  },
  CONFLICT: {
      message: "The request could not be completed due to a conflict with the current state of the resource.",
      code: "ERR409"
  },
  TOO_MANY_REQUESTS: {
      message: "You have sent too many requests in a given amount of time.",
      code: "ERR429"
  }
}
