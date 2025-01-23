const errorHandler = (fn) => {
          return (req, res, next) => {
              Promise.resolve(fn(req, res, next)).catch((e) => {
                  res.status(500).json({
                      msg: "Invalid request: " + e.message
                  });
              });
          };
      };
      
      module.exports = errorHandler;