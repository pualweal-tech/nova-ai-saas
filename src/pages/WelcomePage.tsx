import { useTranslation } from 'react-i18next'
import { Button, Icon } from '../components/ui'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useRouter } from '../app/router'

const AGENTS = [
  { key: 'product', icon: 'lightbulb', status: 'Active' },
  { key: 'ux', icon: 'account_tree', status: 'Waiting' },
  { key: 'design', icon: 'palette', status: 'Waiting' },
  { key: 'code', icon: 'code', status: 'Waiting' },
] as const

export function WelcomePage() {
  const { navigate } = useRouter()
  const { t } = useTranslation()
  return (
    <div className="landing">
      <div className="landing__glow" />
      <nav className="landing-nav">
        <strong>NOVA AI</strong>
        <div className="landing-nav__links">
          <a href="#product">{t('welcome.product')}</a>
          <a href="#product">{t('welcome.solutions')}</a>
          <a href="#product">{t('welcome.pricing')}</a>
          <button type="button" onClick={() => navigate('/')}>
            {t('welcome.docs')}
          </button>
        </div>
        <div className="landing-cta">
          <LanguageSwitcher />
          <button className="text-button" type="button" onClick={() => navigate('/')}>
            {t('welcome.login')}
          </button>
          <Button type="button" onClick={() => navigate('/')}>
            {t('welcome.start')}
            <Icon name="arrow_forward" />
          </Button>
        </div>
      </nav>
      <section className="landing-hero">
        <div className="live-pill">
          <i />
          {t('welcome.live')}
        </div>
        <h1>
          {t('welcome.headline1')}
          <br />
          <span>{t('welcome.headline2')}</span>
        </h1>
        <p>{t('welcome.body')}</p>
        <div className="landing-cta">
          <Button type="button" onClick={() => navigate('/')}>
            <Icon name="rocket_launch" />
            {t('welcome.start')}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/')}>
            <Icon name="play_circle" />
            {t('welcome.watch')}
          </Button>
        </div>
      </section>
      <section id="product" className="agent-row">
        {AGENTS.map((agent) => (
          <article key={agent.key} className="landing-agent">
            <Icon name={agent.icon} />
            <h3>{t(`welcome.agents.${agent.key}.title`)}</h3>
            <p>{t(`welcome.agents.${agent.key}.copy`)}</p>
            <small className="muted">{t('welcome.status')}: {agent.status}</small>
          </article>
        ))}
      </section>
      <footer className="landing-footer">{t('welcome.footer')}</footer>
    </div>
  )
}
