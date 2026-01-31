export const healthHandler = async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DIKE AI API'
  });
};
