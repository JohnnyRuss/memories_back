const Async = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);

export default Async;
