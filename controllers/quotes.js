const Quote = require("../models/Quote");

// @desc        Get all quotes
// @route       GET /api/v1/quotes
// @access      Public
exports.getQuotes = async (req, res, next) => {
  //console.log(req.query);
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };
    const randAmount = req.query.random;

    // Fields to exclude
    const removeFields = ["select", "sort", "random"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // console.log(reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    randAmount
      ? (query = Quote.aggregate([
          { $match: JSON.parse(queryStr) },
          { $sample: { size: parseInt(randAmount) } },
        ]))
      : (query = Quote.aggregate([{ $match: JSON.parse(queryStr) }]));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      console.log(fields);
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Executing query
    const quote = await query;

    res.status(200).json({ success: true, count: quote.length, data: quote });
  } catch (err) {
    next(err);
  }
};

// @desc        Get single quote
// @route       GET /api/v1/quote/:id
// @access      Public
exports.getQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      next(err);
    }
    res.status(200).json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
};

// @desc        Create new quote
// @route       POST /api/v1/quote
// @access      Private
exports.createQuote = async (req, res, next) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json({
      success: true,
      data: quote,
    });
  } catch (err) {
    next(err);
  }
};

// @desc        Update quote
// @route       PUT /api/v1/quote/:id
// @access      Private
exports.updateQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!quote) {
      next(err);
    }

    res.status(200).json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
};

// @desc        Delete quote
// @route       Delete /api/v1/quote/:id
// @access      Private
exports.deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);

    if (!quote) {
      next(err);
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
