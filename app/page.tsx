'use client'
import { ChangeEvent, useState } from "react";

import HeightMapScene from '@/app/HeightMapScene'
export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const getImageData = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    }
    if (e.target.files) reader.readAsDataURL(e.target.files[0])
  }

  return (
    <div className="bg-black flex flex-col p-2 h-[100vh] w-full items-start justify-center">
      <label className="w-24 rounded-lg text-sm bg-white text-center">
        <input className="hidden" type="file" onChange={(e) => getImageData(e)} />
        Add file
      </label>
      <HeightMapScene inputImage={imageUrl} />
    </div>
  );
}
