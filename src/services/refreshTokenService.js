import { saveRefreshToken, blacklistToken, isBlacklisted } from "../models/refreshToken.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const refreshTokens = async (refreshToken, user, device, ipAddress) => {
    const blacklisted = await isBlacklisted(refreshToken);
    if(blacklisted) throw new Error('Blacklisted Token');

    await blacklistToken(refreshToken);

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await saveRefreshToken({
        token: newRefreshToken,
        userId: user.id,
        device,
        ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
    });

    return { accessToken, refreshToken: newRefreshToken }
}
