// @desc        Get all quotes
// @route       GET /api/v1/quotes
// @access      Public
exports.getQuotes = (req, res, next) => {
  res.status(200).json({ succes: true, msg: "Show all quotes" });
};

// @desc        Get single quote
// @route       GET /api/v1/quote/:id
// @access      Public
exports.getQuote = (req, res, next) => {
  res.status(200).json({ succes: true, msg: `Show quote ${req.params.id}` });
};

// @desc        Create new quote
// @route       POST /api/v1/quote
// @access      Private
exports.createQuote = (req, res, next) => {
  res.status(200).json({ succes: true, msg: "Create new quote" });
};

// @desc        Update quote
// @route       PUT /api/v1/quote/:id
// @access      Private
exports.updateQuote = (req, res, next) => {
  res.status(200).json({ succes: true, msg: `Update quote ${req.params.id}` });
};

// @desc        Delete quote
// @route       Delete /api/v1/quote/:id
// @access      Private
exports.deleteQuote = (req, res, next) => {
  res.status(200).json({ succes: true, msg: `Delete quote ${req.params.id}` });
};
