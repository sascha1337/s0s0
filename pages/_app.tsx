import Head from "next/head";
import "../styles/globals.css";

export default function App() {
    
    return (
      
    <div className="flex justify-center">
        <Head>
            <title>Smart Contract Spy</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex-col">
    
            <div className="text-center text-2xl bg-green-500">
            Welcome to Smart Contract Spy
            </div>

            <input className=" font-bold bg-blue-600" type="text" ></input>
            <button className="font-bold bg-gray-500">Search</button>
        </div>

    </div>
     
    )
  }