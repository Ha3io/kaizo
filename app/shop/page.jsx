"use client";

import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import ModList from "@components/ModList";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "@styles/Shop.scss"

const Shop = () => {
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const loggedInUserId = session?.user?._id;

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  const [modList, setModList] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const getModList = async () => {
      const response = await fetch(`api/user/${profileId}/shop`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setModList(data.modList);
      setProfile(data.user);
      setLoading(false);
    };

    if (profileId) {
      getModList();
    }
  }, [profileId]);

  return loading ? <Loader /> : (
    <>
      <Navbar />

      {loggedInUserId === profileId && (
        <h1 className="title-list">Your Mods</h1>
      )}

      {loggedInUserId !== profileId && (
        <h1 className="title-list">{profile.username}'s Mods</h1>
      )}

      <ModList data={modList}/>
    </>
  );
};

export default Shop;
