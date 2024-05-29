"use client"

import Navbar from "@components/Navbar";
import Loader from "@components/Loader";
import ModList from "@components/ModList";
import "@styles/Wishlist.scss";
import { useSession } from "next-auth/react";

const Wishlist = () => {
  const { data: session } = useSession();
  const wishlist = session?.user?.wishlist;

  //onsole.log(wishlist)

  return !session ? <Loader /> :(
    <>
      <Navbar />

      <h1 className="title-list">
        Your Wishlist
      </h1>

      <ModList data={wishlist} />
    </>
  )
}

export default Wishlist