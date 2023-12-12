import { Client } from "typesense";

if (
  !process.env.TYPESENSE_ADMIN_KEY ||
  !process.env.TYPESENSE_SEARCH_KEY
) {
  throw new Error("TYPESENSE_SEARCH_KEY is not set")
}

export const serverConfig = {
  apiKey: process.env.TYPESENSE_ADMIN_KEY,
  nodes: [
    {
      host: "ldck06h2mf9r5pbtp-1.a1.typesense.net",
      port: 443,
      protocol: "https",
    },
  ],
  numRetries: 3,
  connectionTimeoutSeconds: 10,

}

export const typesenseSearch = new Client(serverConfig)

export const typesenseAdmin = new Client(serverConfig)