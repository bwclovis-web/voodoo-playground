/* eslint-disable max-statements */
import { useEffect, useState } from "react"

import { socket } from "../../socket"

const UseSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState("N/A")
  const [usage, setUsage] = useState<any[]>([])

  const onDisconnect = () => {
    socket.disconnect()
    setIsConnected(false)
    setTransport("N/A")
  }

  const logCpu = (cpuData: number) => {
    setUsage(currentUsage => [...currentUsage, cpuData])
  }

  const connectSocket = () => {
    socket.connect()
  }

  const onConnect = () => {
    setIsConnected(true)
    setTransport(socket.io.engine.transport.name)

    socket.io.engine.on("upgrade", transport => {
      setTransport(transport.name)
    })
  }

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on('cpu', cpuData => logCpu(cpuData))

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off('cpu', cpuData => logCpu(cpuData))
    }
  }, [])

  return {
    connectSocket,
    isConnected,
    onDisconnect,
    transport,
    usage
  }
}

export default UseSocket
