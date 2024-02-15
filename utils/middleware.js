export class ResposneError extends Error {
  constructor(code, message) {
    super();
    this.code = code || 500;
    this.message = message;
  }
};

export const errorResponse = (err, req, res, next) => {
  const message = `Failed to process ${req.url}`;

  if (err instanceof ResposneError) {
    res.status(err.code).json({ error: err.message || message });
    return;
  }
  res.status(500).json({
    error: err ? err.message || err.toString() : message,
  });
};
