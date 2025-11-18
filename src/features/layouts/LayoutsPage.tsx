"use client"
import React from 'react'
import CloseFamily from './components/CloseFamily'
import { usePublicFamilyData } from '@/contexts/PublicFamilyContext'

export default function LayoutsPage() {
    const {data} = usePublicFamilyData()
  return (
    <CloseFamily family={data}/>
  )
}
