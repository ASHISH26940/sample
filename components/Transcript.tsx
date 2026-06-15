"use client"

import { useState, useRef, useCallback } from "react"
import { createDeepgramConnection } from "@/lib/deepgram"

export function Transcript() {
  const [transcript, setTranscript] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [error, setError] = useState("")
  const wsRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const transcriptRef = useRef("")

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }

  const startRecording = useCallback(async () => {
    setError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const ws = createDeepgramConnection()
      wsRef.current = ws

      ws.onopen = () => {
        console.log("Deepgram WS connected successfully")
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm"
        const recorder = new MediaRecorder(stream, { mimeType })
        recorderRef.current = recorder

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data)
          }
        }

        recorder.onerror = () => setError("MediaRecorder error")
        recorder.start(250)
        setIsRecording(true)
      }

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === "Results" && msg.channel?.alternatives?.[0]?.transcript) {
            const text = msg.channel.alternatives[0].transcript.trim()
            if (!text) return

            if (msg.is_final) {
              transcriptRef.current += (transcriptRef.current ? " " : "") + text
              setTranscript(transcriptRef.current)
              setWordCount(transcriptRef.current.split(/\s+/).filter(Boolean).length)
            } else {
              setTranscript(transcriptRef.current + " " + text)
            }
            scrollToBottom()
          }
        } catch (err) {
          console.error("WS message parse error:", err)
        }
      }

      ws.onerror = (e) => {
        console.error("Deepgram WS error event:", e)
        setError("WebSocket connection failed. Check your API key is valid and has streaming enabled.")
      }

      ws.onclose = (event) => {
        console.log("Deepgram WS closed - code:", event.code, "reason:", event.reason)
        setIsRecording(false)
      }
    } catch (err) {
      setError("Microphone access denied or unavailable.")
      console.error("Mic error:", err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop()
    wsRef.current?.close()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    recorderRef.current = null
    wsRef.current = null
    streamRef.current = null
    setIsRecording(false)
  }, [])

  const copyTranscript = useCallback(() => {
    navigator.clipboard.writeText(transcript)
  }, [transcript])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`rounded px-6 py-2 font-medium text-white ${
            isRecording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        {isRecording && (
          <span className="flex items-center gap-1 font-medium text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            Recording
          </span>
        )}

        <span className="text-sm text-gray-500">Words: {wordCount}</span>

        {transcript && (
          <button
            onClick={copyTranscript}
            className="text-sm text-blue-600 hover:underline"
          >
            Copy Transcript
          </button>
        )}
      </div>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto rounded border bg-gray-50 p-4 text-gray-800"
      >
        {transcript || (
          <span className="text-gray-400">
            Press &quot;Start Recording&quot; and speak to see your transcript here...
          </span>
        )}
      </div>
    </div>
  )
}
