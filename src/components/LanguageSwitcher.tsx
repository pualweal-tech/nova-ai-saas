import { useTranslation } from 'react-i18next'
import { resolveAppLanguage } from '../i18n'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const active = resolveAppLanguage(i18n.resolvedLanguage ?? i18n.language)

  return (
    <div className="language-switcher" role="group" aria-label={t('common.switchLanguage')}>
      <button
        type="button"
        className={active === 'en' ? 'is-active' : undefined}
        aria-pressed={active === 'en'}
        onClick={() => {
          void i18n.changeLanguage('en')
        }}
      >
        {t('common.english')}
      </button>
      <button
        type="button"
        className={active === 'zh-CN' ? 'is-active' : undefined}
        aria-pressed={active === 'zh-CN'}
        onClick={() => {
          void i18n.changeLanguage('zh-CN')
        }}
      >
        {t('common.chinese')}
      </button>
    </div>
  )
}
