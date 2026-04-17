import React from 'react'

export default function Skeleton({ className = '' }){
  return (
    <div className={`rounded-md bg-slate-700 ${className} animate-pulse`} />
  )
}
