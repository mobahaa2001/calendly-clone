import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex justify-center items-center h-full">
      <button
        onClick={() => signIn('google')}
        className="flex items-center w-80 h-20 px-8 py-2 text-lg rounded bg-white shadow border-2"
      >
        <Image src={'/images/google.png'} width={50} height={50} alt="Google Logo"></Image> Sign in with Google
      </button>
    </div>
  )
}
