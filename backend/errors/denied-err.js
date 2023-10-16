class DeniedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeniedError';
    this.statusCode = 401;
  }
}

module.exports = DeniedError;
