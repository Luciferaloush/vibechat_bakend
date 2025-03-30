const errorHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (e) {
            // تأكد من أن لديك كائن res
            if (res) {
                res.status(500).json({
                    msg: "Invalid request: " + e.message
                });
            } else {
                console.error("Error without response context:", e);
            }
        }
    };
};


module.exports = errorHandler;