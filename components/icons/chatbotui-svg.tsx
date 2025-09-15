import { FC } from "react"
import Image from "next/image"
import logo from "@/public/logo.svg"

interface ChatbotUISVGProps {
  theme: "dark" | "light"
  scale?: number
}

export const ChatbotUISVG: FC<ChatbotUISVGProps> = ({ theme, scale = 1 }) => {
  return (
    <Image
      src={logo}
      alt="nebica Logo"
      width={500 * scale}
      height={200 * scale}
      style={{
        filter: theme === "dark" ? "invert(1)" : "invert(0)",
      }}
    />
  )
}
