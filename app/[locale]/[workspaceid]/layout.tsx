"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { getAssistantWorkspacesByWorkspaceId } from "@/db/assistants"
import { getChatsByWorkspaceId } from "@/db/chats"
import { getCollectionWorkspacesByWorkspaceId } from "@/db/collections"
import { getFileWorkspacesByWorkspaceId } from "@/db/files"
import { getFoldersByWorkspaceId } from "@/db/folders"
import { getModelWorkspacesByWorkspaceId } from "@/db/models"
import { getPresetWorkspacesByWorkspaceId } from "@/db/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/db/prompts"
import { getAssistantImageFromStorage } from "@/db/storage/assistant-images"
import { getToolWorkspacesByWorkspaceId } from "@/db/tools"
import { getWorkspaceById } from "@/db/workspaces"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import { supabase } from "@/lib/supabase/browser-client"
import { LLMID } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Loading from "../loading"
import { getGuestWorkspace } from "@/db/guest-handler"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter()

  const params = useParams()
  const workspaceId = params.workspaceid as string

  const {
    setChatSettings,
    setAssistants,
    setAssistantImages,
    setChats,
    setCollections,
    setFolders,
    setFiles,
    setPresets,
    setPrompts,
    setTools,
    setModels,
    selectedWorkspace,
    setSelectedWorkspace,
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived,
    setChatFiles,
    setChatImages,
    setNewMessageFiles,
    setNewMessageImages,
    setShowFilesDisplay
  } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session
      if (!session) {
        if (workspaceId !== "guest") return router.push("/login")
      }

      await fetchWorkspaceData(workspaceId)
    })()
  }, [])

  useEffect(() => {
    ;(async () => await fetchWorkspaceData(workspaceId))()
    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)

    setIsGenerating(false)
    setFirstTokenReceived(false)

    setChatFiles([])
    setChatImages([])
    setNewMessageFiles([])
    setNewMessageImages([])
    setShowFilesDisplay(false)
  }, [workspaceId])

  const fetchWorkspaceData = async (workspaceId: string) => {
    if (workspaceId === "guest") {
      initializeGuestWorkspace()
      return
    }
    setLoading(true)

    const workspace = await getWorkspaceById(workspaceId)
    setSelectedWorkspace(workspace)

    const assistantData = await getAssistantWorkspacesByWorkspaceId(workspaceId)
    setAssistants(assistantData.assistants)

    for (const assistant of assistantData.assistants) {
      let url = ""

      if (assistant.image_path) {
        url = (await getAssistantImageFromStorage(assistant.image_path)) || ""
      }

      if (url) {
        const response = await fetch(url)
        const blob = await response.blob()
        const base64 = await convertBlobToBase64(blob)

        setAssistantImages(prev => [
          ...prev,
          {
            assistantId: assistant.id,
            path: assistant.image_path,
            base64,
            url
          }
        ])
      } else {
        setAssistantImages(prev => [
          ...prev,
          {
            assistantId: assistant.id,
            path: assistant.image_path,
            base64: "",
            url
          }
        ])
      }
    }

    const chats = await getChatsByWorkspaceId(workspaceId)
    setChats(chats)

    const collectionData =
      await getCollectionWorkspacesByWorkspaceId(workspaceId)
    setCollections(collectionData.collections)

    const folders = await getFoldersByWorkspaceId(workspaceId)
    setFolders(folders)

    const fileData = await getFileWorkspacesByWorkspaceId(workspaceId)
    setFiles(fileData.files)

    const presetData = await getPresetWorkspacesByWorkspaceId(workspaceId)
    setPresets(presetData.presets)

    const promptData = await getPromptWorkspacesByWorkspaceId(workspaceId)
    setPrompts(promptData.prompts)

    const toolData = await getToolWorkspacesByWorkspaceId(workspaceId)
    setTools(toolData.tools)

    const modelData = await getModelWorkspacesByWorkspaceId(workspaceId)
    setModels(modelData.models)

    setChatSettings({
      model: (searchParams.get("model") ||
        workspace?.default_model ||
        "gpt-4-1106-preview") as LLMID,
      prompt:
        workspace?.default_prompt ||
        "You are a friendly, helpful AI assistant.",
      temperature: workspace?.default_temperature || 0.5,
      contextLength: workspace?.default_context_length || 4096,
      includeProfileContext: workspace?.include_profile_context || true,
      includeWorkspaceInstructions:
        workspace?.include_workspace_instructions || true,
      embeddingsProvider:
        (workspace?.embeddings_provider as "openai" | "local") || "openai"
    })

    setLoading(false)
  }

  const initializeGuestWorkspace = () => {
    const guestWorkspace = {
      id: "guest",
      name: "Guest Workspace",
      default_model: "Nebica Ai",
      default_prompt: "You are a friendly, helpful AI assistant.",
      default_temperature: 0.5,
      default_context_length: 4096,
      embeddings_provider: "openai",
      include_profile_context: true,
      include_workspace_instructions: true
    }

    setSelectedWorkspace(guestWorkspace)
    setChatSettings({
      model: guestWorkspace.default_model as LLMID,
      prompt: guestWorkspace.default_prompt,
      temperature: guestWorkspace.default_temperature,
      contextLength: guestWorkspace.default_context_length,
      includeProfileContext: guestWorkspace.include_profile_context,
      includeWorkspaceInstructions:
        guestWorkspace.include_workspace_instructions,
      embeddingsProvider: guestWorkspace.embeddings_provider as
        | "openai"
        | "local"
    })

    // Initialize all states with empty arrays
    setAssistants([])
    setAssistantImages([])
    setChats([])
    setCollections([])
    setFolders([])
    setFiles([])
    setPresets([])
    setPrompts([])
    setTools([])
    setModels([])

    // Load any saved guest data from localStorage
    const savedGuestData = localStorage.getItem("guest-data")
    if (savedGuestData) {
      try {
        const data = JSON.parse(savedGuestData)
        if (data.chats) setChats(data.chats)
        // Restore other states as needed
      } catch (e) {
        console.error("Failed to load guest data", e)
      }
    }

    setLoading(false)
  }

  if (loading) {
    return <Loading />
  }

  return <Dashboard>{children}</Dashboard>
}
