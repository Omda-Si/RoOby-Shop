import serverless from "serverless-http";
import { connectLambda } from "@netlify/blobs";
import { createApp } from "../../server/src/app.js";

const app = createApp();

const run = serverless(app, {
  binary: ["image/*", "application/octet-stream"]
});

export const handler = async (event, context) => {
  // Lets Netlify Blobs find its site and token inside a Lambda-style function.
  if (event?.blobs) {
    try {
      connectLambda(event);
    } catch (error) {
      console.error("connectLambda failed", error);
    }
  }
  return run(event, context);
};
