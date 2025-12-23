const checkOrigin = (req, res, next) => {
  const allowedOrigins = [
    'https://srv1202622.hstgr.cloud',
    'https://sgod-shs.vercel.app'
  ];

  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export default checkOrigin;