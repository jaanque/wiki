'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface MiniChatProps {
  isOpen: boolean
  onClose: () => void
  initialPrompt?: string
}

export default function MiniChat({ isOpen, onClose, initialPrompt }: MiniChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente técnico de wikIA. ¿En qué información sobre modelos puedo ayudarte hoy?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = useCallback(async (overrideInput?: string) => {
    const textToSend = typeof overrideInput === 'string' ? overrideInput : input
    if (!textToSend.trim() || isTyping) return

    const userMsg = textToSend.trim()
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'API error')
      }

      const aiContent = data.choices?.[0]?.message?.content || 'Error: Respuesta vacía del servidor.'
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg = (error instanceof Error && error.message.includes('401'))
        ? 'ERROR_AUTH: La API Key de Groq parece no ser válida.' 
        : 'ERROR_SISTEMA: No se ha podido establecer contacto con el núcleo. Revisa la consola para más detalles.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Process initial prompt when chat opens
  useEffect(() => {
    if (isOpen && initialPrompt && messages.length === 1) {
      handleSend(initialPrompt)
    }
  }, [isOpen, initialPrompt, messages.length, handleSend])

  if (!isOpen) return null

  const renderMessage = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="mini-chat-overlay" onClick={onClose}>
      <div className="mini-chat-window" onClick={e => e.stopPropagation()}>
        <header className="chat-header">
          <h3>WIKIA_ASSISTANT_TERMINAL</h3>
          <button className="close-chat" onClick={onClose}>×</button>
        </header>

        <div className="chat-messages" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role === 'assistant' ? 'msg-ai' : 'msg-user'}`}>
              {renderMessage(msg.content)}
            </div>
          ))}
          {isTyping && (
            <div className="msg msg-ai italic text-gray-400">
              Procesando consulta...
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Escribe tu consulta técnica..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <button className="ask-ai-btn" onClick={() => handleSend()}>Enviar</button>
        </div>
      </div>
    </div>
  )
}
