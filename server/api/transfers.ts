import dotenv from "dotenv";
dotenv.config();
// Store some remote secrets in .env file

import { request, gql } from "graphql-request";
export default async (_req, _res) => {
  const query = gql`
    {
      transfers {
        id #ID!
        from #Bytes! address
        to #Bytes! address
        value #BigInt! # uint256
      }
    }
  `;
  const endpoint = process.env.GRAPH_ENDPOINT;
  const variables = {};
  const headers = {
    "content-type": "application/json",
  };
  const { transfers } = await request(endpoint, query, variables, headers);
  return transfers;
};
