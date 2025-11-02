import { taskRoutes } from "./routes";

const server = Bun.serve({
  port: 8000,
  routes: {
    ...taskRoutes,
  },
  fetch(req) {
    return new Response(`No route for ${new URL(req.url).pathname}`, {
      status: 404,
    });
  },
});

console.log(`🚀 API running at http://${server.hostname}:${server.port}`);
