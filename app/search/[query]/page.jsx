"use client"

import Loader from '@components/Loader'
import Navbar from '@components/Navbar'
import ModList from '@components/ModList'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import "styles/Search.scss"

const SearchPage = () => {
  const { query } = useParams()

  const [loading, setLoading] = useState(true)

  const [modList, setModList] = useState([])

  const getModList = async () => {
    try {
      const response = await fetch(`/api/mod/search/${query}`, {
        method: 'GET',
      })

      const data = await response.json()
      setModList(data)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getModList()
  }, [query])

  return loading ? <Loader /> : (
    <>
      <Navbar />

      <h1 className='title-list'>{query} result(s)</h1>

      <ModList data={modList} />
    </>
  )
}

export default SearchPage