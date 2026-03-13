import { getResourceById } from "../../shared/data";

export async function handler(event: any) {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return response(400, { error: "Resource ID is required" });
    }

    const resource = await getResourceById(id);

    if (!resource) {
      return response(404, { error: "Resource not found" });
    }

    return response(200, resource);
  } catch (err: any) {
    console.error("Detail handler error:", err);
    return response(500, { error: "Internal server error" });
  }
}

function response(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(body),
  };
}
