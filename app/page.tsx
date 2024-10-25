'use client'
import { ChangeEvent, useState } from "react";

import HeightMapScene from '@/components/HeightMapScene'
export default function Home() {
  const [textureUrl, setTextureUrl] = useState<string | null>(null)

  const createImageUrl = (buffer: ArrayBuffer, type: string) => {
    const blob = new Blob([buffer], { type })
    const urlCreator = window.URL || window.webkitURL
    const imageUrl = urlCreator.createObjectURL(blob)
    console.log(imageUrl)
    return imageUrl
  }
  const getTextureFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    const { type } = file
    const buffer = await file.arrayBuffer()
    const imageUrl = createImageUrl(buffer, type)
    setTextureUrl(imageUrl)
    console.log(imageUrl)
  }


  return (
    <div className="flex flex-col h-[100vh] w-full items-center justify-center">
      <input type="file" onChange={(e) => getTextureFile(e)} />
      <HeightMapScene inputTexture={textureUrl} />

    </div>
  );
}
