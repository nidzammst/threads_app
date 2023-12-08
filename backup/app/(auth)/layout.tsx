import { Inter } from 'next/font/google'
export const metadata = {
	title: 'Threads',
	description: 'A Next.js 14 Meta Threads application'
}

import '../globals.css'

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] })
 
function Header() {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
      <h1>My App</h1>
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
    </header>
  );
}

export default function RootLayout({
	children
} : {
	children: React.ReactNode
}) {
	return (<ClerkProvider>
		<html lang="en">
			<body className={`${inter.className} bg-dark-1`}>
        <div className="w-full flex justify-center items-center min-h-screen">
  				{children}
        </div>
			</body>
		</html>
	</ClerkProvider>)
}