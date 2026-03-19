import { getBotnoiToken } from "../firebase/botnoi";

export function extractBotnoiToken(response) {
  if (typeof response === "string") return response;
  if (response?.token) return response.token;
  if (response?.access_token) return response.access_token;
  if (response?.jwt) return response.jwt;
  if (response?.data?.token) return response.data.token;
  if (response?.data?.access_token) return response.data.access_token;
  if (typeof response?.data === "string") return response.data;
  return null;
}

export async function getUserBotnoiToken(user) {
  if (!user) {
    return null;
  }

  const firebaseToken = await user.getIdToken();
  const response = await getBotnoiToken(firebaseToken);
  return extractBotnoiToken(response);
}
