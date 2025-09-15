"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { QuickSettings } from "@/components/chat/quick-settings"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/browser-client"
import Link from "next/link"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })
 const [user, setUser] = useState(false);
 const [loading, setLoading] = useState(false);



useEffect(() => {
  ;(async () => {
    setLoading(true)
    const session = (await supabase.auth.getSession()).data.session
 
    if (session) {
      console.log("hihi")
      setUser(true);
    }
  setLoading(false)
  })()
}, [])


  const { chatMessages } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>

         
{ (!user && !loading )&&
  (<div className="absolute right-4 top-4">
  <Link
    className="
      rounded-full 
      bg-gradient-to-r from-blue-500 to-purple-600 
      px-5 py-2 
      text-sm font-semibold text-white 
      shadow-lg 
      transition-all 
      duration-300 
      hover:scale-105 
      hover:from-blue-400 hover:to-purple-500 
      hover:shadow-xl
    "
      href="/login"
  >
    Login
  </Link>
</div>
)}


          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>

          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
