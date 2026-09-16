export type LifecycleState = 'BOOTING' | 'INITIALIZING' | 'READY' | 'SHUTTING_DOWN';
export type ConversationState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';
export type TaskState = 'QUEUED' | 'PLANNING' | 'WAITING_CONFIRMATION' | 'EXECUTING' | 'VERIFYING' | 'RETRYING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
export type ConnectivityState = 'ONLINE' | 'OFFLINE' | 'DEGRADED';
export type SecurityState = 'NORMAL' | 'SAFE_MODE' | 'LOCKDOWN';
export type PowerState = 'NOMINAL' | 'SAVER' | 'RESTRICTED' | 'CRITICAL';
export type AutomationMode = 'DISABLED' | 'OBSERVE' | 'DIAGNOSE' | 'PROPOSE' | 'APPLY' | 'AUTO';

export type HadesSnapshot = {
  lifecycle: LifecycleState;
  conversation: ConversationState;
  task: TaskState;
  connectivity: ConnectivityState;
  security: SecurityState;
  power: PowerState;
  automation: AutomationMode;
};

export class HadesStateStore {
  private state: HadesSnapshot = {
    lifecycle: 'BOOTING',
    conversation: 'IDLE',
    task: 'QUEUED',
    connectivity: 'ONLINE',
    security: 'NORMAL',
    power: 'NOMINAL',
    automation: 'OBSERVE'
  };

  private listeners = new Set<(state: HadesSnapshot) => void>();

  getSnapshot(): HadesSnapshot {
    return { ...this.state };
  }

  update(patch: Partial<HadesSnapshot>): HadesSnapshot {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
    return this.getSnapshot();
  }

  subscribe(listener: (state: HadesSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const appState = new HadesStateStore();
