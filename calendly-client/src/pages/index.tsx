import { signIn, getSession } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  const signInWithGoogle = () => signIn('google')
  return (
    <div className="flex justify-center items-center h-full">
      <button
        onClick={signInWithGoogle}
        className="flex items-center w-80 h-20 px-8 py-2 text-lg rounded bg-white shadow border-2"
      >
        <Image src={'/images/google.png'} width={50} height={50} alt="Google Logo"></Image> Sign in with Google
      </button>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)

  if (session && session.authenticated) {
    return {
      redirect: {
        destination: '/events',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
