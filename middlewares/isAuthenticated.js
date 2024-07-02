const isAuthenticated =  model=> {
    return async (req, res, next) => {
        //let token from header
        const headerObj = req.headers;
        const token = headerObj.authorization?.split(" ")[1];
      
        //verify token
        const verifiedToken = verifyToken(token);
        if (verifiedToken) {
          const user = await model.findById(verifiedToken.id).select(
            "name email role"
          );
          //save the user into req.obj
          req.userAuth = user;
          next();
        } else {
          const err = new Error("Token expired/invalid");
          next(err);
        }
        //verify token
        //save the user into req.obj
      };
};

module.exports = isAuthenticated;