// import {graphql} from 'graphql'

import { graphql } from "../../gql";

export const verifyUserGoogleToken = graphql(
    `#graphql 
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`
)