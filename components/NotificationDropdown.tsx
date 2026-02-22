"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer flex items-center justify-center w-10 h-10 transition-colors outline-none text-muted hover:bg-muted hover:text-white text-xl rounded">
          <i className="fa-solid fa-bell"></i>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="w-80 bg-zinc-950 border-zinc-800 shadow-2xl rounded-md p-1"
      >
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Notifications
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-zinc-800" />
        
        <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 m-1 transition-colors cursor-pointer rounded-sm focus:bg-zinc-900 focus:text-zinc-100 outline-none">
          <span className="text-sm font-medium">Build Successful</span>
          <span className="text-xs text-zinc-400">Deployment for project-alpha is now live.</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 m-1 transition-colors cursor-pointer rounded-sm focus:bg-zinc-900 focus:text-zinc-100 outline-none">
          <span className="text-sm font-medium">Service Alert</span>
          <span className="text-xs text-zinc-400">Cloudflare DNS propagation complete.</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-800" />
        
        <div className="flex justify-center p-2">
          <button className="text-[10px] uppercase font-bold text-sky-500 hover:text-sky-400 transition-colors">
            Clear All
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}