import Vapi from '@vapi-ai/web'
import { useEffect, useState } from 'react'

interface TranscriptionMessage { 
  role: "user" | "assistant"
  text: string
}

export const useVapi = () => { 
  const [vapi, setVapi] = useState<Vapi | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecing, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptionMessage[]>([])

  useEffect(() => {
    // 
    const vapiInstance = new Vapi('e18a01a6-ba8f-42fd-9ce1-b66ad021b1b5');
    setVapi(vapiInstance)

    vapiInstance.on("call-start", () => { 
      setIsConnected(true)
      setIsConnecting(false)
      setTranscript([])
    })

    vapiInstance.on("call-end", () => { 
      setIsConnected(false)
      setIsConnecting(false)
      setIsSpeaking(false)
    })

    vapiInstance.on("speech-start", () => { 
      setIsSpeaking(true)
    })

    vapiInstance.on("speech-end", () => { 
      setIsSpeaking(false)
    })

    vapiInstance.on("error", (error) => { 
      console.log(error, "VAPI_ERROR")
      setIsConnecting(false)
    })

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") { 
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript
          }
        ])
      }
    })

    return () => { 
      vapiInstance?.stop()
    }
  }, [])

  const startCall = () => { 
    setIsConnecting(true)

    if (vapi) { 
      vapi.start("a315f5c5-cb3e-4bc9-adab-764ed10651dc");
    }
  }

  const endCall = () => { 
    if (vapi) { 
      vapi.stop()
    }
  }

  return { 
    isSpeaking,
    isConnecing,
    isConnected,
    transcript,
    startCall, 
    endCall
  }
}