// src/middleware/auth.js
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to check if a user is authenticated.
 * Accepts token from either cookie or Authorization header.
 */
const isUserAvailable = async (req, res, next) => {
  try {
    // 🔍 Debug: log incoming headers and cookies
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);

    // 🔑 Extract token
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
      console.log("🍪 Token from cookie:", token);
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🪪 Token from header:", token);
    }

    // ❌ No token found
    if (!token) {
      return res
        .status(401)
        .json(new ApiError(401, "User not authenticated — token missing."));
    }

    let decodedToken;

    try {
      // ✅ Verify token safely
      decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("✅ Token decoded:", decodedToken);
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res
        .status(401)
        .json(new ApiError(401, "Invalid or expired token."));
    }

    // 🧠 Find user by ID from token
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Middleware error:", err.message);
    return res.status(500).json(new ApiError(500, "Internal Server Error."));
  }
};

export { isUserAvailable };
