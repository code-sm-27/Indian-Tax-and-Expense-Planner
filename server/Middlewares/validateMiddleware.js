export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.errors ? err.errors[0].message : "Validation failed",
            errors: err.errors || []
        });
    }
};
