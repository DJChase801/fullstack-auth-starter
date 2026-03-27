export default async function handler(request, response) {
  try {
    const { default: app } = await import("../apps/api/src/app.js");
    return app(request, response);
  } catch (error) {
    console.error("Vercel function boot failed.", {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      nodeEnv: process.env.NODE_ENV,
      requestUrl: request.url,
    });
    console.error(error);

    if (!response.headersSent) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ message: "Function boot failed." }));
    }
  }
}
