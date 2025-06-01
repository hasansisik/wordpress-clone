'use client'

import { useEffect, useState } from 'react'
import { Cookie } from 'lucide-react'

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  
  // Cookie preferences state
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and cannot be changed
    functional: false,
    analytics: false,
    performance: false
  })

  useEffect(() => {
    // Check if consent was already given
    const hasConsent = localStorage.getItem('cookieConsent')
    
    // If no consent stored, show the banner
    if (!hasConsent) {
      setShowConsent(true)
    }
  }, [])

  const handleAcceptAll = () => {
    // Set all cookies to true
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      performance: true
    })
    
    // Save to localStorage
    localStorage.setItem('cookieConsent', 'all')
    
    // Close banner
    setShowConsent(false)
    setShowCustomize(false)
  }

  const handleRejectAll = () => {
    // Set only necessary cookies to true
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      performance: false
    })
    
    // Save to localStorage
    localStorage.setItem('cookieConsent', 'necessary')
    
    // Close banner
    setShowConsent(false)
    setShowCustomize(false)
  }

  const handleSavePreferences = () => {
    // Save current preferences to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    
    // Close banner
    setShowConsent(false)
    setShowCustomize(false)
  }

  const togglePreference = (key: keyof typeof preferences) => {
    // Necessary cookies cannot be disabled
    if (key === 'necessary') return
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Don't render anything if user already gave consent
  if (!showConsent && !showCustomize) return (
    <button
      onClick={() => setShowCustomize(true)}
      className="fixed bottom-25 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors shadow-lg"
      aria-label="Cookie Settings"
    >
      <Cookie className="w-7 h-7 text-black" />
    </button>
  )

  return (
    <>
      {/* Main cookie banner */}
      {showConsent && !showCustomize && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 p-4">
          <div className="container mx-auto flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-3">
              <Cookie className="w-7 h-7 text-blue-600" />
              <h4 className="text-sm font-medium">Gizliliğinize değer veriyoruz</h4>
            </div>
            <p className="text-sm text-gray-600 max-w-3xl mb-4">
              Çerezler ile deneyiminizi iyileştiriyoruz. "Tümünü Kabul Et" seçeneğine tıklayarak, çerezlerin kullanımına izin vermiş olursunuz.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCustomize(true)}
                className="px-6 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Özelleştir
              </button>
              <button 
                onClick={handleRejectAll}
                className="px-6 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Tümünü Reddet
              </button>
              <button 
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize preferences modal */}
      {showCustomize && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowCustomize(false)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b">
                <h3 className="text-xl font-medium">Çerez Tercihlerini Özelleştir</h3>
                <button 
                  onClick={() => setShowCustomize(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Kapat</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(80vh - 160px)" }}>
                <p className="mb-4">
                  Gezinmenize yardımcı olmak ve belirli işlevleri gerçekleştirmek için çerezleri kullanıyoruz.
                </p>
                
                <div className="mb-4">
                  <p className="mb-2">
                    "Gerekli" olarak kategorize edilen çerezler, sitenin temel işlevlerini etkinleştirmek için tarayıcınıza depolanır. 
                    {!showMoreInfo && (
                      <button 
                        onClick={() => setShowMoreInfo(true)} 
                        className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                      >
                        Daha fazla göster
                      </button>
                    )}
                  </p>
                  {showMoreInfo && (
                    <div className="mt-3 pl-4 border-l-2 border-blue-200 text-sm text-gray-600">
                      <p className="mb-2">
                        Bu çerezler olmadan, web sitesi düzgün çalışamaz ve yalnızca tarayıcınız tarafından ayarlanabilirler. Bu çerezler, gizlilik tercihlerinizi hatırlamak, giriş yapmak veya formları doldurmak gibi hizmetler için gereklidir.
                      </p>
                      <p className="mb-2">
                        Çerezleri tarayıcı ayarlarınızdan engelleyebilir veya bu tür çerezlerin size gönderildiğinde size bildirimde bulunacak şekilde ayarlayabilirsiniz, ancak bu durumda sitenin bazı bölümleri çalışmayabilir.
                      </p>
                      <p>
                        Bu çerezler, kişisel olarak tanımlanabilir bilgileri saklamaz.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 my-6">
                  {/* Necessary cookies - always on and cannot be changed */}
                  <div className="flex items-center justify-between p-4 border rounded ">
                    <div>
                      <h5 className="font-medium">Gerekli</h5>
                      <p className="text-gray-600 mt-1 text-sm">
                        Gerekli çerezler, güvenli giriş yapma veya tercih ayarlarınızı düzenleme gibi bu sitenin temel özelliklerini etkinleştirmek için gereklidir.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-green-600 font-medium">Aktif</span>
                    </div>
                  </div>

                  {/* Functional cookies */}
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">İşlevsel</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        İşlevsel çerezler, web sitesi içeriğini sosyal medya platformlarında paylaşma ve diğer üçüncü taraf özellikleri sağlar.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.functional}
                          onChange={() => togglePreference('functional')}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>

                  {/* Analytics cookies */}
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">Analitik</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Analitik çerezler, ziyaretçilerin nasıl gezindiğini anlamamıza yardımcı olur ve site performansı hakkında bilgi sağlar.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.analytics}
                          onChange={() => togglePreference('analytics')}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>

                  {/* Performance cookies */}
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">Performans</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Performans çerezleri, web sitesinin performans ölçümlerini anlayarak kullanıcı deneyimini iyileştirmemize yardımcı olur.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.performance}
                          onChange={() => togglePreference('performance')}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 px-2 py-3 border-t">
                <button 
                  onClick={handleRejectAll}
                  className="px-6 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100"
                >
                  Tümünü Reddet
                </button>
                <button 
                  onClick={handleSavePreferences}
                  className="px-6 py-3 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded shadow-sm hover:bg-blue-700"
                >
                  Tercihlerimi Kaydet
                </button>
                <button 
                  onClick={handleAcceptAll}
                  className="px-6 py-3 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded shadow-sm hover:bg-blue-700"
                >
                  Tümünü Kabul Et
                </button>
              </div>
              
              <div className="p-3 text-xs text-right text-gray-500">
                Powered by <span className="font-medium">CookieYes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie icon button - only shown when consent not shown */}
      {!showConsent && (
        <button
          onClick={() => setShowCustomize(true)}
          className="fixed bottom-25 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gray-300 hover:bg-gray-300 transition-colors shadow-lg"
          aria-label="Cookie Settings"
        >
          <Cookie className="w-7 h-7 text-black" />
        </button>
      )}
    </>
  )
}

export default CookieConsent 