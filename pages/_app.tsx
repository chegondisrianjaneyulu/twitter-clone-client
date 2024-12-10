import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {Inter} from 'next/font/google'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({subsets: ['latin']})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
     <GoogleOAuthProvider clientId="1057379915345-s3q7ehemjt8jpr3b7eub2neajbvrg5t7.apps.googleusercontent.com"> 
      <Component {...pageProps} /> 
      <Toaster/>
      </GoogleOAuthProvider>
   
    </div>
  )
}
