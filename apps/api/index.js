let count = 0;

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleSession(websocket) {
  websocket.accept();
  websocket.addEventListener("message", async ({ data }) => {
    websocket.send(JSON.stringify({ hello: "world" }));
  });

  websocket.addEventListener("close", async evt => {
    // Handle when a client closes the WebSocket connection
    console.log(evt);
  });
}

const websocketHandler = async request => {
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

async function handleBuildRequest(request) {
  if (contentType.includes("application/json")) {
    const { body } = await request.json();
    console.log(body);

    return new Response(JSON.stringify(body), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "something went wrong" }), { status: 502 });
}

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/":
        return new Response("build tray api", { status: 200 });
      case "/build":
        return handleBuildRequest(request);
      case "/ws":
        return websocketHandler(request);
      default:
        return new Response("Not found", { status: 404 });
    }
  } catch (err) {
    return new Response(err.toString());
  }
}
