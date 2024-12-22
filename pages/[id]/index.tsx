
import FeedCard from "@/components/feedCard";
import TwitterLayout from "@/components/layout/twitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getUserById } from "@/graphql/query/user";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutations/user";
import { useQueryClient } from "@tanstack/react-query";


interface ServerProps  {
    user? : User
}

const UserProfile: React.FC<ServerProps> = (props) => {
    const {user: currentUser } = useCurrentUser();
    const queryClient = useQueryClient()
   

    const iamFollowing = useMemo(() => {
        if (!props.user) return false;

        return (
            (currentUser?.following?.findIndex(el => el?.id === props.user?.id ) ?? -1) >= 0
        )

    }, [currentUser?.following, props.user])


    const handleFollowUser = useCallback( async () => {
       if (!props?.user?.id) return
       await graphqlClient.request(followUserMutation, {to: props.user.id})
       await queryClient.invalidateQueries({queryKey: ['current-user']})
    }, [queryClient, props.user?.id])

    const handleUnFollowUser =  useCallback(async () => {
        if (!props?.user?.id) return
        await graphqlClient.request(unfollowUserMutation, {to: props.user.id})
        await queryClient.invalidateQueries({queryKey: ['current-user']})
    }, [queryClient, props.user?.id])

    return (
       <div>
        <TwitterLayout>
            <div>
                <nav className="flex items-center gap-3 py-3 px-3">
                    <BsArrowLeftShort  className="text-4xl" />
                    <div>
                    <h1 className="text-lg font-bold">{props.user?.firstName} {props.user?.lastName || ''}</h1>
                    <p className="text-sm font-bold text-slate-500">{props.user?.tweets?.length} Tweets</p>
                </div>
                </nav>
                <div className="p-4 border-b border-slate-800">
                    {props.user?.profileImageUrl && (
                        <Image
                          src={props.user.profileImageUrl}
                          alt='user-image'
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                    )}
                    <h1 className="text-lg font-bold">{props.user?.firstName} {props.user?.lastName || ''}</h1>
                    <div className="flex items-center justify-between">

                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                            <span>{props.user?.follower?.length} Followers</span>
                            <span>{props.user?.following?.length} Following</span>
                        </div>

                        {currentUser?.id !== props.user?.id && (
                            <>
                              {iamFollowing ? (
                                <button onClick={() => handleUnFollowUser()} className="bg-white text-black px-3 py-1 text-sm rounded-full">Unfollow</button>
                              ) : <button onClick={() => handleFollowUser()} className="bg-white text-black px-3 py-1 text-sm rounded-full">Follow</button>}
                            
                            </>
                        )}
                    </div>
                </div>
                <div>
                    {props.user?.tweets?.map((tweet) => (
                        tweet && <FeedCard key={tweet.id} data={tweet as Tweet} />
                    ))}
                </div>
            </div>
        </TwitterLayout>
       </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.query.id as string | undefined

    if ( !id ) return {notFound: true,}

    const userInfo = await graphqlClient.request(getUserById, {id})

    if (!userInfo.getUserById) return {notFound: true}

    return {
        props: {
            user: userInfo.getUserById as User
        }
    }
}

export default UserProfile