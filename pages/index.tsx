import React from "react";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import FeedCard from "@/components/feedCard";
import { SlOptions } from "react-icons/sl";


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
  return (
      <div>
       <div className="grid grid-cols-12 h-screen w-screen px-56">
          <div className="col-span-3  pt-1 ">
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

          </div>
          <div className="col-span-6 border-r border-l h-screen overflow-scroll  border-gray-600">
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
          </div>
          <div className="col-span-3"></div>
       </div>
      
      </div>
  );
}
