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
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/query/tweets";
import axios from "axios";
import toast from "react-hot-toast";

interface HomeProps {
  tweets?: Tweet[]
}

export default function Home(props: HomeProps) {
  const [content, setContent] = useState('')
  const [imageURL, setImageURL] = useState('')

  const user = useCurrentUser();
  // const {tweets} = useGetAllTweets();
  const { mutate } = useCreateTweet()
  
  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
      imageUrl:imageURL,
    })
    setContent('')
    setImageURL('')
  }, [content, mutate, imageURL])


  const handleInputFunction = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      try {
        event.preventDefault();
        const file: File | null | undefined = input.files?.item(0);
  
       

        console.log('file', file)
        if ( !file ) return
  
        const fileExtension = file.type.split('/')[1]; 

        const { getSignedURLForTweet } = await graphqlClient.request(getSignedURLForTweetQuery, {
          imageName: file.name,
          imageType: fileExtension
        })
  
        if ( getSignedURLForTweet ) {
            toast.loading('Uploading....', {id:'2'})
            await axios.put(getSignedURLForTweet, file, {
              headers: {
                'Content-Type': file.type
              }
            })
            toast.success('Upload Completed', {id:'2'})
            const url = new URL(getSignedURLForTweet) 
            const myFilePath = `${url.origin}${url.pathname}`
            setImageURL(myFilePath)
  
        }
      }
      catch (e:any) {
        const graphqlErrors = e.response?.errors;
      if (graphqlErrors && graphqlErrors.length > 0) {
        graphqlErrors.forEach((error: any) => {
          console.error("GraphQL Error Message:", error.message);
          toast.error(error.message); // Display the error message in a toast
        });
      } else {
        console.error("Unexpected Error:", e.message);
        toast.error(e.message || "An unexpected error occurred.");
      }
      }


       
    }
  }, [])


  const handleImageSelect = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')

    const handleFunction = handleInputFunction(input)

    input.addEventListener('change', handleFunction)

    input.click();
  }, [handleInputFunction])


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
                  {imageURL && 
                    <Image
                      src={imageURL}
                      alt='tweet-image'
                      height={300}
                      width={300}
                    />
                  
                  }
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
