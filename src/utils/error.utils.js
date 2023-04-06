class HttpError {
  constructor(statusText, status = 500, error) {
    this.status = status;
    this.description = statusText;
    error && (this.details = error);
  }
}

module.exports = HttpError

