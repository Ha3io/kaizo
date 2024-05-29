"use client"

import React, { useState } from 'react'
import Form from '@components/Form'
import Navbar from '@components/Navbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const CreateMod = () => {
  const { data: session } = useSession()

  const router = useRouter()

  const [mod, setMod] = useState({
    creator: "",
    category: "",
    title: "",
    description: "",
    price: "",
    downloads: "0",
    photos: []
  })

  if (session) {
    mod.creator = session?.user?._id
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const newModForm = new FormData()

      for (var key in mod) {
        newModForm.append(key, mod[key])
      }

      mod.photos.forEach((photo) => {
        newModForm.append("modPhotoPaths", photo)
      })
      console.log(mod);
      const response = await fetch("/api/mod/new", {
        method: "POST",
        body: newModForm
      })

      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`)
      }
    } catch (err) {
      console.log("Publish Mod failed", err.message)
    }
  }

  return (
    <>
      <Navbar />
      <Form
        type="Create"
        mod={mod}
        setMod={setMod}
        handleSubmit={handleSubmit}
      />
    </>
  )
}

export default CreateMod