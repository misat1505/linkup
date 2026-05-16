export function extractRefreshTokenFromSetCookieString(line: string) {
	const match = line.match(/refresh-token=([^;]+)/);
	const refreshToken = match?.[1];
	return refreshToken;
}
