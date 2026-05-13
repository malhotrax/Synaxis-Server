export const asyncWrapper = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res)).catch((err) => next(err));
	};
};
