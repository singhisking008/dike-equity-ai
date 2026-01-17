/**
 * @fileoverview DIKE AI Health Check Endpoint
 * 
 * PRODUCTION-READY HEALTH MONITORING
 * 
 * Simple health check endpoint for monitoring server status and load balancer
 * integration. Returns a basic status response for monitoring systems.
 * 
 * FEATURES:
 * - Lightweight response for fast health checks
 * - Timestamp for monitoring uptime
 * - Service identification for multi-service environments
 * - CORS support for cross-origin monitoring
 * - HTTP status code compliance
 * 
 * USE CASES:
 * - Load balancer health checks
 * - Monitoring system integration
 * - Service discovery
 * - Deployment verification
 * - Uptime monitoring
 * 
 * @author Utkarsh Priyadarshi
 * @version 1.0.0
 * @since 2025
 * @license MIT
 * @repository https://github.com/your-username/dike-equity-ai
 * @deployment https://your-app.vercel.app
 */

/**
 * Health check endpoint handler
 * 
 * Returns a standardized health status response for monitoring systems.
 * This endpoint is designed to be called frequently by monitoring
 * services and load balancers to verify service availability.
 * 
 * @function handler
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void} Sends JSON response with server status
 * @example
 * // Health check response
 * GET /api/health
 * Response: {
 *   "status": "ok",
 *   "timestamp": "2025-01-16T15:40:00.000Z",
 *   "service": "DIKE AI API"
 * }
 */
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DIKE AI API',
    version: '1.0.0',
    uptime: process.uptime ? Math.floor(process.uptime()) : null
  });
}
