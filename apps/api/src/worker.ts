import { readRequestBody } from "./util";

export default {
  async fetch(request: Request, env: Env) {
    return handleRequest(request, env);
  }
};

async function handleSession(websocket: WebSocket) {
  websocket.accept();
  websocket.addEventListener("message", async ({ data }: any) => {
    websocket.send(JSON.stringify({ hello: "world" }));
  });

  websocket.addEventListener("close", async (evt: Event) => {
    // Handle when a client closes the WebSocket connection
    console.log(evt);
  });
}

const websocketHandler = async (request: Request) => {
  const upgradeHeader = request.headers.get("Upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const [client, server] = Object.values(new WebSocketPair());
  await handleSession(server);

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
};

async function handleBuildRequest(request: Request) {
  const body: any = await readRequestBody(request);
  if (!body) {
    return new Response("Something bad happened?", { status: 500 });
  }

  if (body?.action) {
    console.log("Got action", body.action);
  }

  return new Response(body);
}

async function handleRequest(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/":
        return new Response("build tray api", { status: 200 });
      case "/webhook":
        return handleBuildRequest(request);
      case "/ws":
        return websocketHandler(request);
      default:
        return new Response("Not found", { status: 404 });
    }
  } catch (err) {
    // return new Response(err.toString());
  }
}
