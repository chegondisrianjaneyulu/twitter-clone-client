
import FeedCard from "@/components/feedCard";
import TwitterLayout from "@/components/layout/twitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import React from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getUserById } from "@/graphql/query/user";


interface ServerProps  {
    user? : User
}

const UserProfile: React.FC<ServerProps> = (props) => {
    // const {user } = useCurrentUser();

    return (
       <div>
        <TwitterLayout>
            <div>
                <nav className="flex items-center gap-3 py-3 px-3">
                    <BsArrowLeftShort  className="text-4xl" />
                    <div>
                    <h1 className="text-lg font-bold">Sri</h1>
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
                    <h1 className="text-lg font-bold">Sri</h1>
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