'use client'
import { ChangeEvent, useState } from "react";

import HeightMapScene from '@/components/HeightMapScene'
export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // const createImageUrl = (buffer: ArrayBuffer, type: string) => {
  //   const blob = new Blob([buffer], { type })
  //   const urlCreator = window.URL || window.webkitURL
  //   const imageUrl = urlCreator.createObjectURL(blob)
  //   setImageUrl(imageUrl)
  // }
  // const getImageUrl = async (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) return
  //   const file = e.target.files[0]
  //   const { type } = file
  //   const buffer = await file.arrayBuffer()
  //   createImageUrl(buffer, type)
  // }
  const getImageData = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      setImageUrl(reader.result as string);
    }
    if (e.target.files) reader.readAsDataURL(e.target.files[0])
  }

  return (
    <div className="flex flex-col h-[100vh] w-full items-center justify-center">
      <input type="file" onChange={(e) => getImageData(e)} />
      <HeightMapScene inputImage={imageUrl} />
    </div>
  );
}
