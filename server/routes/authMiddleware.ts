import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send("Access denied. User is not logged in.");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(403).send("Invalid token");
    }
};

// Checks users role against required role to use route in route definitions use: 'authorizeRole(["admin"])' : swapping admin, user, seller, or buyer
export const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
