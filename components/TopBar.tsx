import { auth } from "@/auth"
import Image from "next/image"

export default async function TopBar() {
  const session = await auth()
  const user = session?.user

  return (
    <header className="w-full h-16 bg-white border-b border-sky-200 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="font-bold text-xl text-sky-900 tracking-tight uppercase flex items-baseline gap-1">
          Nydus <span className="text-sky-500 text-xs">.arvo.team</span>
        </div>
        
        <div className="h-6 w-px bg-sky-200"></div>
      </div>

      <div className="flex items-center gap-3 text-sm font-bold text-sky-900 cursor-pointer hover:bg-sky-50 px-3 py-2 transition-colors duration-200 border border-transparent hover:border-sky-100">
        <span className="uppercase">{user?.name || 'UNKNOWN USER'}</span>
        <div className="w-8 h-8 bg-sky-900 text-white flex items-center justify-center text-xs font-mono overflow-hidden relative border border-sky-900">
          {user?.image ? (
            <Image 
              src={user.image} 
              alt="User Avatar" 
              fill
              className="object-cover"
            />
          ) : (
            <span>ID</span>
          )}
        </div>
      </div>
    </header>
  )
}