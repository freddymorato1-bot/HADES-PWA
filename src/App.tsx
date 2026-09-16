import { useEffect, useMemo, useState } from 'react';
import { buildPatch, type Patch, type Issue } from './lib/automation';
import { checkPolicy, type PolicyDecision } from './lib/policy';
import { translations, type Language } from './i18n';

type Mode = 'OBSERVE' | 'DIAGNOSE' | 'PROPOSE' | 'APPLY' | 'AUTO';

type Problem = Issue;

const initialProblems: Problem[] = [
  { id: 'p-1', title: 'Tarea fallida', severity: 'ERROR', summary: 'El builder de clientes no respondió a la validación del último checkpoint.', module: 'builder' },
  { id: 'p-2', title: 'Permiso revocado', severity: 'WARNING', summary: 'El acceso a ubicación quedó sin autorización para la tarea de mapa.', module: 'maps' },
  { id: 'p-3', title: 'Error no capturado', severity: 'CRITICAL', summary: 'Se detectó una excepción en un módulo del estado global.', module: 'core' }
];

const systemVersion = 'v0.1.0 · foundation';

export default function App() {
  const [language, setLanguage] = useState<Language>('es');
  const [mode, setMode] = useState<Mode>('OBSERVE');
  const [listening, setListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [automationOpen, setAutomationOpen] = useState(true);
  const [selectedProblemId, setSelectedProblemId] = useState(initialProblems[0].id);
  const [appliedPatch, setAppliedPatch] = useState<Patch | null>(null);

  const t = translations[language];
  const selectedProblem = useMemo(() => initialProblems.find((problem) => problem.id === selectedProblemId) ?? initialProblems[0], [selectedProblemId]);
  const patch = useMemo(() => buildPatch(selectedProblem), [selectedProblem]);
  const policyDecision: PolicyDecision = useMemo(() => checkPolicy('automation.patch', 'app://automation/patch', { risk: patch.risk_level, requiresConfirmation: patch.requires_confirmation }), [patch]);

  useEffect(() => {
    if (!listening) {
      setAudioLevel(0);
      return;
    }
    const interval = window.setInterval(() => setAudioLevel((value) => Math.max(12, Math.min(100, value + (Math.random() > 0.5 ? 10 : -8)))), 260);
    return () => window.clearInterval(interval);
  }, [listening]);

  const onApplyPatch = () => {
    if (!policyDecision.allowed || policyDecision.authorizationLevel !== 'L3') return;
    if (!window.confirm(t.confirmPatch)) return;
    setAppliedPatch({ ...patch, applied_at: new Date().toISOString(), status: 'PENDING_VERIFICATION' });
    setMode('APPLY');
  };

  const visualScale = 0.9 + audioLevel / 200;
  return (
    <div className="app-shell">
      <div className="scanlines" />
      <header className="topbar">
        <div className="status-left"><span className={`listening-indicator ${listening ? 'on' : 'off'}`} /><span>{listening ? t.listeningOn : t.listeningOff}</span></div>
        <div className="system-title">{t.title}</div>
        <div className="topbar-right"><span className="version-text">{systemVersion}</span><button type="button" className="info-button" aria-label={t.infoButtonLabel}>i</button><button type="button" className="language-button" onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} aria-label={t.languageLabel}>{language.toUpperCase()}</button></div>
      </header>

      <main className="core-panel"><div className="core-scene" aria-label={t.avatarLabel}><div className="nebula" /><div className="orbital orbit-1" style={{ transform: `scale(${visualScale})` }} /><div className="orbital orbit-2" style={{ transform: `scale(${visualScale * 1.08})` }} /><div className="orbital orbit-3" style={{ transform: `scale(${visualScale * 1.14})` }} /><div className="core-sphere" style={{ transform: `scale(${visualScale})` }} /><div className="ring ring-outer" style={{ opacity: 0.35 + audioLevel / 200 }} /><div className="particle-field" aria-hidden="true" /></div></main>

      <section className="hud-summary"><div className="summary-block"><span className="label">{t.systemStatus}</span><strong>{t.systemReady}</strong></div><div className="summary-block"><span className="label">{t.policy}</span><strong>{policyDecision.authorizationLevel}</strong></div><div className="summary-block"><span className="label">{t.activity}</span><strong>{listening ? t.listening : t.idle}</strong></div></section>

      <aside className={`automation-panel ${automationOpen ? 'open' : 'closed'}`}><div className="panel-header"><div className="mode-badge">{mode}</div><button type="button" className="secondary-button" onClick={() => setAutomationOpen((open) => !open)}>{automationOpen ? t.collapse : t.expand}</button></div><div className="panel-layout"><div className="problems-column"><h3>{t.detectedIssues}</h3><ul>{initialProblems.map((problem) => <li key={problem.id} className={problem.id === selectedProblem.id ? 'selected' : ''}><button type="button" onClick={() => setSelectedProblemId(problem.id)}><span className={`severity ${problem.severity.toLowerCase()}`}>{problem.severity}</span><span>{problem.title}</span></button></li>)}</ul></div><div className="details-column"><h3>{selectedProblem.title}</h3><p>{selectedProblem.summary}</p><div className="details-card"><span>{t.module}</span><strong>{selectedProblem.module}</strong></div><div className="diff-box"><h4>{t.patchPreview}</h4><pre>{patch.diff[0]?.oldCode}</pre><div className="arrow">→</div><pre>{patch.diff[0]?.newCode}</pre></div><div className="actions-row"><button type="button" className="primary-button" onClick={onApplyPatch} disabled={!policyDecision.allowed}>{t.applyPatch}</button><button type="button" className="secondary-button" onClick={() => setMode('PROPOSE')}>{t.proposeFix}</button></div></div><div className="logs-column"><h3>{t.liveLogs}</h3><div className="log-list"><span>policy.check = {policyDecision.allowed ? 'CONFIRM' : 'DENY'}</span><span>mode = {mode}</span><span>{appliedPatch ? `patch:${appliedPatch.patch_id}` : 'patch: pending verification'}</span><span>audio.level = {audioLevel}</span></div></div></div></aside>

      <nav className="bottom-nav" aria-label={t.navigationLabel}><button type="button" className="nav-button" aria-label={t.clockLabel}>◔</button><button type="button" className="nav-button" aria-label={t.exportLabel}>⇪</button><button type="button" className={`mic-button ${listening ? 'active' : ''}`} aria-label={listening ? t.micOn : t.micOff} onClick={() => setListening((current) => !current)}>◉</button><button type="button" className="nav-button" aria-label={t.settingsLabel}>⚙</button><button type="button" className="nav-button" aria-label={t.securityLabel}>▣</button></nav>
      <button type="button" className="help-button" aria-label={t.helpLabel}>?</button>
    </div>
  );
}
