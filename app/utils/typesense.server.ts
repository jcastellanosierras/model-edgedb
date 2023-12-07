import { Client } from "typesense";

if (
  !process.env.TYPESENSE_ADMIN_KEY ||
  !process.env.TYPESENSE_SEARCH_KEY
) {
  throw new Error("TYPESENSE_SEARCH_KEY is not set")
}

export const typesenseSearch = new Client({
  nodes: [
    {
      host: "uxjpvryn0aweh1itp-1.a1.typesense.net",
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: process.env.TYPESENSE_SEARCH_KEY,
  connectionTimeoutSeconds: 10,
  numRetries: 3
})

export const typesenseAdmin = new Client({
  nodes: [
    {
      host: "uxjpvryn0aweh1itp-1.a1.typesense.net",
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_KEY,
  connectionTimeoutSeconds: 10,
  numRetries: 3
})
