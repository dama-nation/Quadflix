// Validation utilities for backend requests
import Joi from 'joi';

// Validation schemas
const schemas = {
  // User validation
  userSignup: Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().min(8).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long'
    })
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  }),

  // Movie/TV show validation
  tmdbId: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number',
      'any.required': 'ID is required'
    })
  }),

  // Search validation
  searchQuery: Joi.object({
    query: Joi.string().min(1).max(100).required().messages({
      'string.empty': 'Search query is required',
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query must not exceed 100 characters'
    }),
    type: Joi.string().valid('movie', 'tv', 'all').default('all').messages({
      'string.valid': 'Type must be either movie, tv, or all'
    })
  }),

  // Discover movies validation
  discoverMovieQuery: Joi.object({
    year: Joi.number().integer().min(1900).max(2030).allow('').optional(),
    genre: Joi.string().allow('').optional(),
    sort_by: Joi.string().default('popularity.desc'),
    page: Joi.number().integer().min(1).default(1)
  }),

  // Platform movies validation
  platformMovieQuery: Joi.object({
    genre: Joi.string().allow('').optional(),
    page: Joi.number().integer().min(1).default(1)
  }),

  // Rating validation (1-10 scale)
  ratingScale: Joi.object({
    value: Joi.number().integer().min(1).max(10).required().messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must not exceed 10',
      'any.required': 'Rating value is required'
    })
  }),

  // Thumbs up/down rating validation
  thumbRating: Joi.object({
    mediaId: Joi.number().integer().positive().required().messages({
      'number.base': 'Media ID must be a number',
      'number.integer': 'Media ID must be an integer',
      'number.positive': 'Media ID must be a positive number',
      'any.required': 'Media ID is required'
    }),
    mediaType: Joi.string().valid('movie', 'tv').required().messages({
      'string.empty': 'Media type is required',
      'string.valid': 'Media type must be either movie or tv'
    }),
    rating: Joi.boolean().required().messages({
      'boolean.base': 'Rating must be a boolean',
      'any.required': 'Rating value is required'
    })
  }),

  // List item validation
  listItem: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number',
      'any.required': 'ID is required'
    }),
    title: Joi.string().allow('').optional(),
    name: Joi.string().allow('').optional(),
    poster_path: Joi.string().allow('').optional(),
    backdrop_path: Joi.string().allow('').optional(),
    media_type: Joi.string().valid('movie', 'tv').required().messages({
      'string.empty': 'Media type is required',
      'string.valid': 'Media type must be either movie or tv'
    }),
    vote_average: Joi.number().min(0).max(10).allow(null).optional(),
    release_date: Joi.string().allow('').optional(),
    first_air_date: Joi.string().allow('').optional()
  }).custom((value, helpers) => {
    // Ensure at least one of title or name is provided
    if (!value.title && !value.name) {
      return helpers.message('Either title or name must be provided');
    }
    return value;
  }),

  // Watch history validation
  watchHistory: Joi.object({
    mediaId: Joi.number().integer().positive().required().messages({
      'number.base': 'Media ID must be a number',
      'number.integer': 'Media ID must be an integer',
      'number.positive': 'Media ID must be a positive number',
      'any.required': 'Media ID is required'
    }),
    mediaType: Joi.string().valid('movie', 'tv').required().messages({
      'string.empty': 'Media type is required',
      'string.valid': 'Media type must be either movie or tv'
    }),
    progress: Joi.number().min(0).max(100).allow(null).optional().messages({
      'number.base': 'Progress must be a number',
      'number.min': 'Progress must be at least 0',
      'number.max': 'Progress must not exceed 100'
    }),
    currentTime: Joi.number().min(0).allow(null).optional().messages({
      'number.base': 'Current time must be a number',
      'number.min': 'Current time must be at least 0'
    }),
    episode: Joi.number().integer().min(1).allow(null).optional().messages({
      'number.base': 'Episode must be a number',
      'number.integer': 'Episode must be an integer',
      'number.min': 'Episode must be at least 1'
    }),
    season: Joi.number().integer().min(1).allow(null).optional().messages({
      'number.base': 'Season must be a number',
      'number.integer': 'Season must be an integer',
      'number.min': 'Season must be at least 1'
    })
  })
};

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Helper validators for specific param types
const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export { schemas, validate, validateParams, validateQuery };