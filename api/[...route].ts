import app from "../apps/api/src/app.js";

type AppRequest = Parameters<typeof app>[0];
type AppResponse = Parameters<typeof app>[1];

export default function handler(request: AppRequest, response: AppResponse) {
  return app(request, response);
}
