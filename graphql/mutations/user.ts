import { graphql } from "@/gql";



export const followUserMutation = graphql(`#graphql
    mutation FollowUserMutation($to: ID!) {
        followUser(to: $to)
    }
`)


export const unfollowUserMutation = graphql(`#graphql
    mutation Mutation($to: ID!) {
        unFollowUser(to: $to)
    }
`)