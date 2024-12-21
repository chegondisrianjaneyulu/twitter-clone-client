import { graphql } from "@/gql";


export const getAllTweetsQuery = graphql(`#graphql
    query GetAllTweets {
        getAllTweets {
            content
            id
            imageUrl
            author {
                id
                firstName
                lastName
                profileImageUrl
            }
        }
    }
`)