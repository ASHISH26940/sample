const API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || ""

export function createDeepgramConnection(): WebSocket {
  const url = `wss://api.deepgram.com/v1/listen?model=nova-3&interim_results=true&smart_format=true&language=en`
  return new WebSocket(url, ["token", API_KEY])
}
