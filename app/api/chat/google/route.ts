import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    // const profile = await getServerProfile()

    const genAI = new GoogleGenerativeAI("AIzaSyDtJ6Xea0o8Sfz_uuQ7RYW7KTl3Yh9mk9I")
    const googleModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const lastMessage = messages.pop()

    const chat = googleModel.startChat({
      history: messages,
      generationConfig: {
        temperature: chatSettings.temperature
      }
    })

    const response = await chat.sendMessageStream(lastMessage.parts)

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response.stream) {
          const chunkText = chunk.text()
          controller.enqueue(encoder.encode(chunkText))
        }
        controller.close()
      }
    })

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error: any) {
    console.error("Error in Google Chat API:", error)
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Google Gemini API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("api key not valid")) {
      errorMessage =
        "Google Gemini API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
