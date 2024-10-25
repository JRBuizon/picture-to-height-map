'use client'
import Image from "next/image";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  inputImage: FileList,
};


export default function Home() {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      if (imageRef.current) imageRef.current.src = reader.result as string;
    }
    reader.readAsDataURL(data.inputImage[0])
  }

  return (
    <div className="flex flex-col h-[100vh] w-full items-center justify-center">
      <Image ref={imageRef} alt="background image" src={''} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("inputImage", { required: true })} type="file" accept=".jpeg, .png, .jpg" />
        <button type="submit">submit</button>
      </form>

    </div>
  );
}
