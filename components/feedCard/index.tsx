import Image from "next/image";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";

const FeedCard :React.FC = () => {
   return (
     <div className="p-5 border-t border-gray-600 hover:bg-slate-900  cursor-pointer transition-all">
      <div className="grid grid-cols-12 gap-3 ">
            <div className="col-span-1">
              <Image 
                src={"https://avatars.githubusercontent.com/u/101683205?v=4"}
                alt='user-profile'
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <div className="col-span-11">
                <h1>Elon Musk</h1>
                <p>Exactly! I have great respect for the American people, who saw through the relentless propaganda and voted for change.</p>
            
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