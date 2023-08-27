const Author = require("../models/Author");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Get all authors
// @route       GET /v1/authors
// @access      Public
exports.getAuthors = asyncHandler(async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };
    const randAmount = req.query.random;

    // Fields to exclude
    const removeFields = ["select", "sort", "random", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

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

    query = Author.aggregate(queryParams);

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
    const total = await Author.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const author = await query;

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
      .json({ success: true, count: author.length, pagination, data: author });
  } catch (err) {
    next(err);
  }
});

// @desc        Get single author
// @route       GET /v1/author/:id
// @access      Public
exports.getAuthor = asyncHandler(async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return next(
        new ErrorResponse(`Author not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

// @desc        Create new author
// @route       POST /v1/author
// @access      Private
exports.createAuthor = asyncHandler(async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({
      success: true,
      data: author,
    });
  } catch (err) {
    next(err);
  }
});

// @desc        Update author
// @route       PUT /v1/author/:id
// @access      Private
exports.updateAuthor = asyncHandler(async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!author) {
      return next(
        new ErrorResponse(`Author not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

// @desc        Delete author
// @route       Delete /v1/author/:id
// @access      Private
exports.deleteAuthor = asyncHandler(async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return next(
        new ErrorResponse(`Author not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});
