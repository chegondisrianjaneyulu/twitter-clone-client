import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleToken } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";

interface TwitterLayoutProps {
    children: React.ReactNode
}

interface TwitterSidebarButton {
    title: string;
    icon: React.ReactNode;
    link: string;
}
 


const TwitterLayout:React.FC<TwitterLayoutProps> = ({children}) => {
    const user = useCurrentUser();
    const queryClient = useQueryClient();

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


    const sideBarMenuItems: TwitterSidebarButton[] = useMemo(() => (
      [
        {
          title: 'Home',
          icon:  <BiHomeCircle/>,
          link: '/'
        },
        {
          title: 'Explore',
          icon:  <BiHash/>,
          link: '/'
        },
        {
          title: 'Notifications',
          icon:  <BsBell/>,
          link: '/'
        },
        {
          title: 'Messages',
          icon:  <BsEnvelope/>,
          link: '/'
        },
        {
          title: 'Bookmarks',
          icon:  <BsBookmark/>,
          link: '/'
        },
        {
          title: 'Twitter Blue',
          icon:  <BiMoney/>,
          link: '/'
        },
        {
          title: 'Profile',
          icon:  <BiUser/>,
          link: `/${user.data?.getCurrentUser?.id}`
        },
        {
          title: 'More Options',
          icon:  <SlOptions/>,
          link: '/'
        },
        // {
        //   title: 'Bookmarks',
        //   icon:  <BsBookmark/>
        // }
   ]
  
    ), [user.data?.getCurrentUser?.id])

    return (
       <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
          <div className="col-span-2 sm:col-span-3 pt-1 flex sm:justify-end pr-4 relative">
            <div>
                <div className="hover:bg-gray-800 p-4 h-fit w-fit rounded-full cursor-pointer transition-all">
                <BsTwitter className="text-2xl"/>
                </div>

                <div className="mt-1 text-xl  pr-4">
                    <ul>
                      {sideBarMenuItems.map((item, idx) => (
                        <li key={idx}>
                         <Link className="flex justify-start gap-4 items-center hover:bg-gray-800 w-fit rounded-full px-5 py-2 cursor-pointer transition-all mt-2" href={item.link} >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="hidden sm:inline">{item.title}</span>
                         </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 px-3">
                    <button className="hidden sm:block bg-[#1d9bf0] py-4 px-2 text-lg font-semibold rounded-full w-full">Tweet</button>
                    <button className="block sm:hidden bg-[#1d9bf0] py-2 px-4 text-lg font-semibold rounded-full w-full"><BsTwitter/></button>
                    </div>

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
              <div className="hidden sm:block">
                <h3 className="text-xl" >{user.data.getCurrentUser.firstName} {user.data.getCurrentUser.lastName}</h3>
              </div>
            </div>)}
          </div>

          <div className="col-span-10 sm:col-span-6 border-r border-l h-screen overflow-scroll  border-gray-600">{children}</div>

          <div className="col-span-0 sm:col-span-3 p-5">
              {!user.data?.getCurrentUser ? <div className="p-2 w-60 bg-slate-700 rounded-lg">
                <h1 className="my-2 text-2xl">New to Twitter?</h1>
                <GoogleLogin onSuccess={handleLoginWithGoogle} />
              </div> : 
                <>
                {/* {user?.data?.getCurrentUser?.recommendedUsers?.length > 0 && ( */}
                  <>
                  <div className="px-4 py-2 bg-slate-800 w-[290px] rounded-lg">
                    <h1 className="my-2 text-2xl mb-5">Users You May Know</h1>
                    {user.data.getCurrentUser.recommendedUsers?.map((el) => (
                        <div key={el?.id} className="flex items-center gap-3 mt-2">
                          {el?.profileImageUrl && <Image className="rounded-full" src={el.profileImageUrl} alt="user-follow-image" width={60} height={60} />}
                          <div className="text-lg">
                            <div>{el?.firstName} {el?.lastName}</div>
                            <Link href={`/${el?.id}`} className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg">View</Link>
                          </div>
                        </div>
                    ))} 
                  </div>
                  </>
                {/* ) } */}
                
                
                </>
              }
          </div>
       </div>
    )
}

export default TwitterLayout