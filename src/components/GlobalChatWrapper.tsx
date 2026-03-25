'use client'

import { useState, useEffect } from 'react'
import MiniChat from './MiniChat'

export default function GlobalChatWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>()

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev)
    const handleOpen = () => {
      setInitialPrompt(undefined)
      setIsOpen(true)
    }
    const handleOpenWithPrompt = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setInitialPrompt(detail?.prompt)
      setIsOpen(true)
    }
    
    window.addEventListener('toggle-mini-chat', handleToggle)
    window.addEventListener('open-mini-chat', handleOpen)
    window.addEventListener('open-mini-chat-with-prompt', handleOpenWithPrompt)
    
    return () => {
      window.removeEventListener('toggle-mini-chat', handleToggle)
      window.removeEventListener('open-mini-chat', handleOpen)
      window.removeEventListener('open-mini-chat-with-prompt', handleOpenWithPrompt)
    }
  }, [])

  return (
    <MiniChat 
      isOpen={isOpen} 
      initialPrompt={initialPrompt}
      onClose={() => setIsOpen(false)} 
    />
  )
}
