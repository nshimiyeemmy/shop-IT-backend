//Method to handle catch errors globally

module.exports = func => (req,res,next) =>
Promise.resolve(func(req,res,next))
   .catch(next)