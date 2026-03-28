function getNormalizedPath(routeParam) {
  const rawSegments = Array.isArray(routeParam) ? routeParam : [routeParam];
  const segments = rawSegments
    .flatMap((segment) => String(segment).split("/"))
    .filter(Boolean);

  if (segments.length === 0) {
    return "/";
  }

  return `/${segments.join("/")}`;
}

function normalizeRequestUrl(request) {
  const url = new URL(request.url ?? "/", "http://localhost");
  const currentPath = url.pathname;

  if (currentPath !== "/" && !currentPath.includes("[...route]")) {
    return;
  }

  const routeParam = request.query?.["...route"] ?? request.query?.route;

  if (!routeParam) {
    return;
  }

  const searchParams = new URLSearchParams(url.search);

  searchParams.delete("...route");
  searchParams.delete("route");

  const normalizedPath = getNormalizedPath(routeParam);
  const normalizedSearch = searchParams.toString();

  request.url = normalizedSearch ? `${normalizedPath}?${normalizedSearch}` : normalizedPath;
}

export default async function handler(request, response) {
  try {
    normalizeRequestUrl(request);

    const { default: app } = await import("../apps/api/dist/src/app.js");
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
