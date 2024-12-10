import { Tweet } from "@/gql/graphql";
import Image from "next/image";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";

interface FeedCardProps{
  data: Tweet
}

const FeedCard :React.FC<FeedCardProps> = (props) => {
  const {data} = props

   return (
     <div className="p-5 border-t border-gray-600 hover:bg-slate-900  cursor-pointer transition-all">
      <div className="grid grid-cols-12 gap-3 ">
            <div className="col-span-1">
              {data.author?.profileImageUrl && 
              <Image 
              src={data.author?.profileImageUrl}
              alt='user-profile'
              width={50}
              height={50}
              className="rounded-full"
            />} 
            </div>
            <div className="col-span-11">
                <h1>{data.author?.firstName} {data.author?.lastName}</h1>
                <p>{data.content}</p>
            
                <div className="flex justify-between mt-5 text-xl items-center w-[90%]">
                    <div>
                        <BiMessageRounded/>
                    </div>

                    <div>
                        <FaRetweet/>
                    </div>

                    <div>
                        <AiOutlineHeart/>
                    </div>

                    <div>
                        <BiUpload/>
                    </div>
                </div>
            </div>
      </div>
     </div>
   )
}

export default FeedCard