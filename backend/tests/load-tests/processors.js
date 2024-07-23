module.exports = {
  extractCookie: function (req, res, context, ee, next) {
    const setCookieHeader = res.headers["set-cookie"];
    if (setCookieHeader) {
      const tokenCookie = setCookieHeader.find((cookie) =>
        cookie.startsWith("token=")
      );
      if (tokenCookie) {
        const token = tokenCookie.split(";")[0].split("=")[1];
        context.vars.token = token;
      }
    }
    return next();
  },
};
