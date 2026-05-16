import { User } from "@packages/schemas";
import axios from "axios";
import { useEffect, useRef } from "react";

export const useRefreshToken = (user: User | null | undefined) => {
	const refreshTokenIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const handleRefreshToken = async () => {
			if (!user) return;

			try {
				await axios.post("/api/auth/refresh");
			} catch (error) {
				console.error("Error refreshing token:", error);
			}
		};

		handleRefreshToken();

		refreshTokenIntervalRef.current = setInterval(handleRefreshToken, 10 * 60 * 1000);

		return () => {
			if (refreshTokenIntervalRef.current !== null) {
				clearInterval(refreshTokenIntervalRef.current);
			}
		};
	}, [user]);
};
