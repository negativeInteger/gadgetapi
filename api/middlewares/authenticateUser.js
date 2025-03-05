import { isLoggedIn } from "./isLoggedIn.js";
import { verifyRefreshToken } from "./verifyRefreshToken.js";

export const authenticateUser = [isLoggedIn, verifyRefreshToken];