import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/")

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-sky-200 shadow-lg">
        <div className="bg-sky-50 border-b border-sky-200 p-4 flex justify-between items-center">
          <div className="font-bold text-sky-900 tracking-tight uppercase flex items-baseline gap-1">
            Nydus <span className="text-sky-500 text-xs">.arvo.team</span>
          </div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-xl text-center font-bold text-slate-900 uppercase tracking-wide font-mono">
              Authentication Required
            </h1>
            <p className="text-sm text-center text-slate-600 font-mono">
              Please login with your Discord account connected to Arvo.
            </p>
            <p className="text-sm text-center text-slate-600 font-mono">
              Nydus uses Discord accounts for authentication.
            </p>
          </div>

          <div className="h-px w-full bg-sky-100"></div>

          <form
            action={async () => {
              "use server"
              await signIn("discord")
            }}
            className="w-full"
          >
            <button 
              type="submit" 
              className="w-full bg-sky-900 text-white font-mono uppercase text-sm font-bold py-3 px-4 hover:bg-sky-800 transition-colors border border-sky-900 flex items-center justify-center gap-2"
            >
              <span>Authenticate via Discord</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
