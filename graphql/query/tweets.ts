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

export const getSignedURLForTweetQuery = graphql(`
    query GetSignedUrl($imageName: String!, $imageType: String!) {
        getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
    }
`)