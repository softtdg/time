exports.getHealth = async (req, res) => {
  try {
    return res.ok({
      message: 'time_backend is running',
      data: {
        status: 'ok',
        env: process.env.NODE_ENV || 'local',
      },
    });
  } catch (error) {
    console.log('getHealth error: ', error);
    return res.failureResponse({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
