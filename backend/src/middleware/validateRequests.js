const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validationTargets = [
        { key: 'body', data: req.body },
        { key: 'params', data: req.params },
        { key: 'query', data: req.query }
      ];

      validationTargets.forEach(({ key, data }) => {
        if (schema[key]) {
          const { error } = schema[key].validate(data, { abortEarly: false });
          if (error) throw error;
        }
      });

      next();
    } catch (err) {
      next(err); 
    }
  };
};

export default validate;
