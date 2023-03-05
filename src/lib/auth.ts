export function getJwtSecretKey(): string | undefined {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error("You must provide valid JWT token");
  }

  return secret;
}
