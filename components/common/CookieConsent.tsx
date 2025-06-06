'use client'

import { useEffect, useState } from 'react'
import { Cookie } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getGeneral } from '@/redux/actions/generalActions'

const CookieConsent = () => {
  const dispatch = useDispatch()
  const [showConsent, setShowConsent] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  // Get general settings from Redux store
  const { general, loading } = useSelector((state: RootState) => state.general)

  // Cookie preferences state
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and cannot be changed
    functional: false,
    analytics: false,
    performance: false
  })

  // Cookie settings with defaults
  const cookieSettings = {
    enabled: general?.cookieConsent?.enabled !== undefined ? general.cookieConsent.enabled : true,
    title: general?.cookieConsent?.title || 'Gizliliğinize değer veriyoruz',
    description: general?.cookieConsent?.description || 'Çerezler ile deneyiminizi iyileştiriyoruz. "Tümünü Kabul Et" seçeneğine tıklayarak, çerezlerin kullanımına izin vermiş olursunuz.',
    modalTitle: general?.cookieConsent?.modalTitle || 'Çerez Tercihlerini Özelleştir',
    modalDescription: general?.cookieConsent?.modalDescription || 'Gezinmenize yardımcı olmak ve belirli işlevleri gerçekleştirmek için çerezleri kullanıyoruz.',
    necessaryTitle: general?.cookieConsent?.necessaryTitle || 'Gerekli',
    necessaryDescription: general?.cookieConsent?.necessaryDescription || 'Gerekli çerezler, güvenli giriş yapma veya tercih ayarlarınızı düzenleme gibi bu sitenin temel özelliklerini etkinleştirmek için gereklidir.',
    functionalTitle: general?.cookieConsent?.functionalTitle || 'İşlevsel',
    functionalDescription: general?.cookieConsent?.functionalDescription || 'İşlevsel çerezler, web sitesi içeriğini sosyal medya platformlarında paylaşma ve diğer üçüncü taraf özellikleri sağlar.',
    analyticsTitle: general?.cookieConsent?.analyticsTitle || 'Analitik',
    analyticsDescription: general?.cookieConsent?.analyticsDescription || 'Analitik çerezler, ziyaretçilerin nasıl gezindiğini anlamamıza yardımcı olur ve site performansı hakkında bilgi sağlar.',
    performanceTitle: general?.cookieConsent?.performanceTitle || 'Performans',
    performanceDescription: general?.cookieConsent?.performanceDescription || 'Performans çerezleri, web sitesinin performans ölçümlerini anlayarak kullanıcı deneyimini iyileştirmemize yardımcı olur.',
    moreInfoText: general?.cookieConsent?.moreInfoText || 'Daha fazla göster',
    acceptAllText: general?.cookieConsent?.acceptAllText || 'Tümünü Kabul Et',
    rejectAllText: general?.cookieConsent?.rejectAllText || 'Tümünü Reddet',
    customizeText: general?.cookieConsent?.customizeText || 'Özelleştir',
    savePreferencesText: general?.cookieConsent?.savePreferencesText || 'Tercihlerimi Kaydet',
    alwaysActiveText: general?.cookieConsent?.alwaysActiveText || 'Aktif',
    iconColor: general?.cookieConsent?.iconColor || '#000000',
    buttonBgColor: general?.cookieConsent?.buttonBgColor || '#cccccc',
    position: general?.cookieConsent?.position || 'bottom-left'
  }

  // Fetch general settings if not already loaded
  useEffect(() => {
    if (!general && !loading) {
      dispatch(getGeneral() as any)
    }
  }, [dispatch, general, loading])

  useEffect(() => {
    // Check if consent was already given
    const hasConsent = localStorage.getItem('cookieConsent')
    
    // If no consent stored, show the banner
    if (!hasConsent) {
      setShowConsent(true)
    }
  }, [])

  // If cookie consent is disabled in admin settings, don't show anything
  if (!cookieSettings.enabled) return null

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

  // Get position class based on settings
  const getPositionClass = () => {
    return cookieSettings.position === 'bottom-right' ? 'right-6' : 'left-6'
  }

  // Don't render anything if user already gave consent
  if (!showConsent && !showCustomize) return (
    <button
      onClick={() => setShowCustomize(true)}
      className={`fixed bottom-25 ${getPositionClass()} z-50 flex items-center justify-center w-14 h-14 rounded-full transition-colors shadow-lg`}
      style={{ backgroundColor: cookieSettings.buttonBgColor }}
      aria-label="Cookie Settings"
    >
      <Cookie className="w-7 h-7" style={{ color: cookieSettings.iconColor }} />
    </button>
  )

  return (
    <>
      {/* Main cookie banner */}
      {showConsent && !showCustomize && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 p-3 md:p-4">
          <div className="container mx-auto flex flex-col items-center text-center px-2">
            <div className="flex items-center gap-3 mb-2">
              <Cookie className="w-6 h-6 text-blue-600" />
              <h4 className="text-base font-medium">{cookieSettings.title}</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-3xl mb-3">
              {cookieSettings.description}
            </p>
            <div className="flex justify-center gap-2 w-full">
              <button 
                onClick={() => setShowCustomize(true)}
                className="px-3 py-2 text-xs sm:text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 flex-1 max-w-[120px]"
              >
                {cookieSettings.customizeText}
              </button>
              <button 
                onClick={handleRejectAll}
                className="px-3 py-2 text-xs sm:text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 flex-1 max-w-[120px]"
              >
                {cookieSettings.rejectAllText}
              </button>
              <button 
                onClick={handleAcceptAll}
                className="px-3 py-2 text-xs sm:text-sm text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700 flex-1 max-w-[120px]"
              >
                {cookieSettings.acceptAllText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize preferences modal */}
      {showCustomize && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowCustomize(false)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center px-3 py-2 border-b">
                <h4 className="text-sm sm:text-base font-medium">{cookieSettings.modalTitle}</h4>
                <button 
                  onClick={() => setShowCustomize(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Kapat</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="px-3 py-2 sm:px-4 sm:py-3 overflow-y-auto" style={{ maxHeight: "calc(80vh - 120px)" }}>
                <p className="text-xs sm:text-sm mb-3">
                  {cookieSettings.modalDescription}
                </p>
                
                <div className="mb-3">
                  <p className="text-xs sm:text-sm mb-2">
                    "{cookieSettings.necessaryTitle}" olarak kategorize edilen çerezler, sitenin temel işlevlerini etkinleştirmek için tarayıcınıza depolanır. 
                    {!showMoreInfo && (
                      <button 
                        onClick={() => setShowMoreInfo(true)} 
                        className="text-blue-600 hover:text-blue-700 ml-1 font-medium text-xs"
                      >
                        {cookieSettings.moreInfoText}
                      </button>
                    )}
                  </p>
                  {showMoreInfo && (
                    <div className="mt-2 pl-3 border-l-2 border-blue-200 text-xs text-gray-600">
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

                <div className="space-y-3 my-4">
                  {/* Necessary cookies - always on and cannot be changed */}
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="pr-2">
                      <h5 className="font-medium text-xs sm:text-sm">{cookieSettings.necessaryTitle}</h5>
                      <p className="text-gray-600 mt-1 text-xs">
                        {cookieSettings.necessaryDescription}
                      </p>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <span className="text-xs text-green-600 font-medium whitespace-nowrap">{cookieSettings.alwaysActiveText}</span>
                    </div>
                  </div>

                  {/* Functional cookies */}
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="pr-2">
                      <h5 className="font-medium text-xs sm:text-sm">{cookieSettings.functionalTitle}</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        {cookieSettings.functionalDescription}
                      </p>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.functional}
                          onChange={() => togglePreference('functional')}
                        />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>

                  {/* Analytics cookies */}
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="pr-2">
                      <h5 className="font-medium text-xs sm:text-sm">{cookieSettings.analyticsTitle}</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        {cookieSettings.analyticsDescription}
                      </p>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.analytics}
                          onChange={() => togglePreference('analytics')}
                        />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>

                  {/* Performance cookies */}
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="pr-2">
                      <h5 className="font-medium text-xs sm:text-sm">{cookieSettings.performanceTitle}</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        {cookieSettings.performanceDescription}
                      </p>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.performance}
                          onChange={() => togglePreference('performance')}
                        />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 p-3 border-t">
                <button 
                  onClick={handleRejectAll}
                  className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100 flex-1 max-w-[120px]"
                >
                  {cookieSettings.rejectAllText}
                </button>
                <button 
                  onClick={handleSavePreferences}
                  className="px-3 py-2 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded shadow-sm hover:bg-blue-700 flex-1 max-w-[120px]"
                >
                  {cookieSettings.savePreferencesText}
                </button>
                <button 
                  onClick={handleAcceptAll}
                  className="px-3 py-2 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded shadow-sm hover:bg-blue-700 flex-1 max-w-[120px]"
                >
                  {cookieSettings.acceptAllText}
                </button>
              </div>
              
              <div className="p-2 text-xs text-right text-gray-500">
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
          className={`fixed bottom-25 ${getPositionClass()} z-50 flex items-center justify-center w-14 h-14 rounded-full transition-colors shadow-lg`}
          style={{ backgroundColor: cookieSettings.buttonBgColor }}
          aria-label="Cookie Settings"
        >
          <Cookie className="w-7 h-7" style={{ color: cookieSettings.iconColor }} />
        </button>
      )}
    </>
  )
}

export default CookieConsent 