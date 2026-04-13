import jwt from "jsonwebtoken";

const authUser = async (request, response, next) => {
  const { token } = request.cookies;
  if (!token) {
    return response.json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id != null) {
      request.userId = tokenDecode.id;
      next();
    } else {
      return response.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

export default authUser;
