/**
 * A simple in-memory rate limiting implementation for Next.js API routes
 */

const LRU = require('lru-cache');

/**
 * Creates a rate limiter instance
 * @param {Object} options - Rate limiting options
 * @param {number} options.interval - Time window in milliseconds
 * @param {number} options.uniqueTokenPerInterval - Max number of unique tokens per interval
 * @param {number} options.max - Max number of requests per token per interval
 * @returns {Object} - Rate limiter instance
 */
const rateLimit = (options) => {
  const tokenCache = new LRU({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    /**
     * Check if the request should be rate limited
     * @param {Object} res - Response object
     * @param {number} limit - Max number of requests per token per interval
     * @param {string} token - Unique token for the request (e.g., IP address, API key)
     * @returns {Promise} - Resolves if the request is allowed, rejects if rate limited
     */
    check: (res, limit, token) => {
      // Get the client's IP address or use the provided token
      const tokenKey = token || getIP(res);
      const tokenCount = (tokenCache.get(tokenKey) || 0) + 1;

      // Set remaining headers for client information
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - tokenCount));

      // If token count is within limit, increment and allow the request
      if (tokenCount <= limit) {
        tokenCache.set(tokenKey, tokenCount);
        return Promise.resolve();
      }

      // Set headers for rate limiting
      res.setHeader('Retry-After', Math.floor(options.interval / 1000));
      
      // Reject with a rate limit error
      return Promise.reject(new Error('Rate limit exceeded'));
    },
  };
};

/**
 * Get the client's IP address from request headers
 * @param {Object} req - Request object
 * @returns {string} - Client IP address
 */
const getIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

module.exports = rateLimit; 