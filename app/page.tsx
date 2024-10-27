'use client'
import { ChangeEvent, useState } from "react";

import HeightMapScene from '@/components/HeightMapScene'
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
    <div className="flex flex-col h-[100vh] w-full items-center justify-center">
      <input type="file" onChange={(e) => getImageData(e)} />
      <HeightMapScene inputImage={imageUrl} />
    </div>
  );
}
