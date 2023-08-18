const Quote = require("../models/Quote");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Get all quotes
// @route       GET /api/v1/quotes
// @access      Public
exports.getQuotes = asyncHandler(async (req, res, next) => {
  //console.log(req.query);
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };
    const randAmount = req.query.random;

    // Fields to exclude
    const removeFields = ["select", "sort", "random", "page", "limit"];

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

    queryParams = [];
    queryParams.push({ $match: JSON.parse(queryStr) });

    // Finding resource

    if (randAmount) {
      queryParams.push({ $sample: { size: parseInt(randAmount) } });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",");
      let project = {};
      fields.forEach((value) => {
        project.$project = Object.assign({}, project.$project, {
          [value]: 1,
        });
      });
      queryParams.push(project);
    }

    query = Quote.aggregate(queryParams);

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Quote.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const quote = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res
      .status(200)
      .json({ success: true, count: quote.length, pagination, data: quote });
  } catch (err) {
    next(err);
  }
});

// @desc        Get single quote
// @route       GET /api/v1/quote/:id
// @access      Public
exports.getQuote = asyncHandler(async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
});

// @desc        Create new quote
// @route       POST /api/v1/quote
// @access      Private
exports.createQuote = asyncHandler(async (req, res, next) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json({
      success: true,
      data: quote,
    });
  } catch (err) {
    next(err);
  }
});

// @desc        Update quote
// @route       PUT /api/v1/quote/:id
// @access      Private
exports.updateQuote = asyncHandler(async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!quote) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
});

// @desc        Delete quote
// @route       Delete /api/v1/quote/:id
// @access      Private
exports.deleteQuote = asyncHandler(async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);

    if (!quote) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});
