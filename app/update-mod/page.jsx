"use client";

import Navbar from "@components/Navbar";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "@components/Loader";
import Form from "@components/Form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const UpdateMod = () => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const modId = searchParams.get("id");

  const [mod, setMod] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    photos: [],
  });

  useEffect(() => {
    const getModDetails = async () => {
      const response = await fetch(`api/mod/${modId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setMod({
        category: data.category,
        title: data.title,
        description: data.description,
        price: data.price,
        photos: data.modPhotoPaths,
      });

      setLoading(false);
    };

    if (modId) {
      getModDetails();
    }
  }, [modId]);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const updateFormMod = new FormData()

      for (var key in mod) {
        updateFormMod.append(key, mod[key])
      }

      mod.photos.forEach((photo) => {
        updateFormMod.append("modPhotoPaths", photo)
      })
      const response = await fetch(`/api/mod/${modId}`, {
        method: "PATCH",
        body: updateFormMod
      })

      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`)
      }
    } catch (err) {
      console.log("Publish Mod failed", err.message)
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <Form
        type="Edit"
        mod={mod}
        setMod={setMod}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default UpdateMod;