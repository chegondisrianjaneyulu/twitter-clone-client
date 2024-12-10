// import {graphql} from 'graphql'

import { graphql } from "../../gql";

export const verifyUserGoogleToken = graphql(
    `#graphql 
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`
)


export const getCurrentUserQuery = graphql(
  `#graphql 
    query GetCurrentUser {
        getCurrentUser {
          email
          id
          firstName
          lastName
          profileImageUrl
        }
    }
  `
);