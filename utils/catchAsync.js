const catchAsync = (fn) => {
  return (request, response, next) => {
    fn(request, response, next).catch((err) => {
      next(err);
    });
  };
};

export default catchAsync;
