import React, { useCallback, useState } from "react";
import { BiHash, BiHomeCircle, BiImageAlt, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import FeedCard from "@/components/feedCard";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleToken } from "@/graphql/query/user";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";

interface TwitterSidebarButton {
   title: string;
   icon: React.ReactNode
}

const sideBarMenuItems: TwitterSidebarButton[] = [
    {
      title: 'Home',
      icon:  <BiHomeCircle/>
    },
    {
      title: 'Explore',
      icon:  <BiHash/>
    },
    {
      title: 'Notifications',
      icon:  <BsBell/>
    },
    {
      title: 'Messages',
      icon:  <BsEnvelope/>
    },
    {
      title: 'Bookmarks',
      icon:  <BsBookmark/>
    },
    {
      title: 'Twitter Blue',
      icon:  <BiMoney/>
    },
    {
      title: 'Profile',
      icon:  <BiUser/>
    },
    {
      title: 'More Options',
      icon:  <SlOptions/>
    },
    // {
    //   title: 'Bookmarks',
    //   icon:  <BsBookmark/>
    // }
]

export default function Home() {

  const [content, setContent] = useState('')


  const user = useCurrentUser();
  const {tweets} = useGetAllTweets();
  const { mutate } = useCreateTweet()
  

  const queryClient = useQueryClient();



  console.log(user)



  const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
        const googleToken = cred.credential;
        if (!googleToken) return toast.error('Google token not found');

        const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleToken, {token: googleToken});

        toast.success("Verified Success");

        console.log("verifyGoogleToken",verifyGoogleToken)

        if (verifyGoogleToken) {
          window.localStorage.setItem('__twitter_token', verifyGoogleToken)
          await queryClient.invalidateQueries({
            queryKey: ["current-user"]
          })
        }

       

  }, [queryClient])

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
       <div className="grid grid-cols-12 h-screen w-screen px-56">
          <div className="col-span-3  pt-1 relative">
            <div className="hover:bg-gray-800 p-4 h-fit w-fit rounded-full cursor-pointer transition-all">
              <BsTwitter className="text-2xl"/>
            </div>

            <div className="mt-1 text-xl  pr-4">
                <ul>
                  {sideBarMenuItems.map((item, idx) => (
                     <li key={idx} className="flex justify-start gap-4 items-center hover:bg-gray-800 w-fit rounded-full px-5 py-2 cursor-pointer transition-all mt-2">
                       <span className="text-2xl">{item.icon}</span>
                       <span>{item.title}</span>
                     </li>
                  ))}
                </ul>

                <div className="mt-5 px-3">
                 <button className="bg-[#1d9bf0] py-4 px-2 text-lg font-semibold rounded-full w-full">Tweet</button>
                </div>

            </div>

            {user.data?.getCurrentUser && (
              <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
              {user?.data && user.data.getCurrentUser?.profileImageUrl && (
                  <Image
                    src={user.data.getCurrentUser?.profileImageUrl}
                    alt="user-image"
                    height={50}
                    width={50}
                    className="rounded-full "
                  />
              )}
              <div>
                <h3 className="text-xl" >{user.data.getCurrentUser.firstName} {user.data.getCurrentUser.lastName}</h3>
              </div>
            </div>)}
          </div>
          <div className="col-span-6 border-r border-l h-screen overflow-scroll  border-gray-600">
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
            {tweets &&  tweets?.map(tweet => tweet && <FeedCard key={tweet.id} data={tweet as Tweet} />)}
            {/* <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/> */}
          </div>
          <div className="col-span-3 p-5">
              {!user.data?.getCurrentUser && <div className="p-2 w-60 bg-slate-700 rounded-lg">
                <h1 className="my-2 text-2xl">New to Twitter?</h1>
                <GoogleLogin onSuccess={handleLoginWithGoogle} />
              </div>}
          </div>
       </div>
      
      </div>
  );
}
