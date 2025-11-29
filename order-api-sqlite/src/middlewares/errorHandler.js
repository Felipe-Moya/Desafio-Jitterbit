function errorHandler(err, req, res, next) {
    console.error(err);
    if (res.headersSent) return next(err);
    const message = (err && err.message) ? err.message : 'Erro interno do servidor';
    res.status(500).json({ error: message });
}


module.exports = errorHandler;