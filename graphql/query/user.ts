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
          tweets {
            id
            content
            author {
              firstName
              lastName
              profileImageUrl
            }
          }
        }
    }
  `
);


export const getUserById = graphql(`#graphql
    query GetUserById( $id: ID!) {

      getUserById(id: $id) {
        firstName
        id
        lastName
        profileImageUrl
        tweets {
          content
          id
          imageUrl
          author {
            firstName
            lastName
            id
            profileImageUrl
          }
        }
      }
    }
`)