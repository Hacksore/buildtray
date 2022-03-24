
/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
 async function readRequestBody(request) {
    const { headers } = request;
    const contentType = headers.get("content-type") || "";
  
    if (contentType.includes("application/json")) {
      return await request.json();
    } else if (contentType.includes("application/text")) {
      return request.text();
    } else if (contentType.includes("text/html")) {
      return request.text();
    }
  
    return null;
  }
  

export { readRequestBody };