'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

const WhatsAppButton = () => {
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: true,
    phoneNumber: '+905555555555',
    message: 'Merhaba, size nasıl yardımcı olabilirim?'
  })

  useEffect(() => {
    // Load WhatsApp config from localStorage
    const savedConfig = localStorage.getItem('whatsappConfig')
    if (savedConfig) {
      setWhatsappConfig(JSON.parse(savedConfig))
    }
  }, [])

  if (!whatsappConfig.enabled) return null

  const handleWhatsAppClick = () => {
    // Close mobile menu if open
    const mobileMenu = document.querySelector('.mobile-header-active')
    if (mobileMenu && mobileMenu.classList.contains('sidebar-visible')) {
      mobileMenu.classList.remove('sidebar-visible')
    }

    const encodedMessage = encodeURIComponent(whatsappConfig.message)
    const whatsappUrl = `https://wa.me/${whatsappConfig.phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-lg"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </button>
  )
}

export default WhatsAppButton 