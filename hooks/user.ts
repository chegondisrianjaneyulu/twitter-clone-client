import { graphqlClient } from "@/clients/api"
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutations/user"
import { getCurrentUserQuery } from "@/graphql/query/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"




export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ['current-user'],
        queryFn: () => graphqlClient.request(getCurrentUserQuery)
    })
    return {...query, user: query.data?.getCurrentUser}
}