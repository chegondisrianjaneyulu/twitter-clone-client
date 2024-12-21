import React, { useCallback, useState } from "react";
import {  BiImageAlt, } from "react-icons/bi";
import FeedCard from "@/components/feedCard";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/layout/twitterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweets";


interface HomeProps {
  tweets?: Tweet[]
}

export default function Home(props: HomeProps) {
  const [content, setContent] = useState('')
  const user = useCurrentUser();
  // const {tweets} = useGetAllTweets();
  const { mutate } = useCreateTweet()
  
  const handleCreateTweet = useCallback(() => {
    mutate({
      content
    })
    setContent('')
  }, [content, mutate])

  const handleImageSelect = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click();
  }, [])


  return (
      <div>
         <TwitterLayout>
          <div>
               <div className="p-5 border-t border-gray-600 hover:bg-slate-900  cursor-pointer transition-all">
                <div className="grid grid-cols-12 gap-3 ">
                <div className="col-span-1">
                  {user?.data && user.data.getCurrentUser?.profileImageUrl && (
                    <Image 
                      src={user.data.getCurrentUser?.profileImageUrl}
                      alt='user-profile'
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  )}
                </div>

                 <div className="col-span-11">
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-transparent text-xl outline-none px-3 border-b border-slate-700" placeholder="What's happening?" rows={3}></textarea>
                  <div className="mt-2 flex items-center justify-between">
                    <BiImageAlt onClick={handleImageSelect} className="text-xl"/>
                    <button onClick={handleCreateTweet} className="bg-[#1d9bf0] py-1 px-4 text-sm font-semibold rounded-full">Tweet</button>
                  </div>
                </div>
                
                </div>
              </div>
          </div>
          {props.tweets &&  props.tweets?.map(tweet => tweet && <FeedCard key={tweet.id} data={tweet as Tweet} />)}
         </TwitterLayout>
      </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
   const allTweets = await graphqlClient.request(getAllTweetsQuery);
   
   return {
      props: {
        tweets: allTweets.getAllTweets as Tweet[]
      }
   }

}
