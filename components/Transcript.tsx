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

      ws.onerror = () => {
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
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
      {/* Recording button + indicator */}
      <div className="flex flex-col items-center gap-4 text-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-8 py-3 text-sm font-semibold tracking-wider uppercase border border-[#283618] transition-colors duration-200 active:translate-y-px flex items-center gap-2 ${
            isRecording
              ? "bg-[#ba1a1a] text-[#ffffff] hover:bg-[#93000a]"
              : "bg-[#606C38] text-[#FEFAE0] hover:bg-[#283618]"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            {isRecording ? (
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            ) : (
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            )}
          </svg>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        {isRecording && (
          <div className="text-xs font-bold tracking-wider text-[#ba1a1a] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
            Live
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-3xl border border-[#BC6C25] bg-[#FEFAE0] p-3 text-xs font-bold text-[#BC6C25] flex items-center gap-1">
          <svg className="w-4 h-4 fill-[#BC6C25]" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
          {error}
        </div>
      )}

      {/* Transcript area */}
      <div className="w-full flex flex-col gap-3">
        <div
          ref={scrollRef}
          className="w-full h-64 border border-[#283618] bg-[#FEFAE0] p-4 overflow-y-auto text-lg text-[#283618] leading-relaxed"
        >
          {transcript ? (
            transcript
          ) : (
            <span className="opacity-50">Waiting for audio input...</span>
          )}
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold opacity-70">Words: {wordCount}</span>
          {transcript && (
            <button
              onClick={copyTranscript}
              className="text-sm font-semibold tracking-wider uppercase text-[#DDA15E] hover:text-[#283618] hover:underline transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Transcript
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
