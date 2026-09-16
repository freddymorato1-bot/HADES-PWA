export type HadesEventMap = {
  'system.start': { timestamp: string };
  'system.shutdown': { timestamp: string };
  'system.error': { message: string; module: string; timestamp: string };
  'task.created': { taskId: string; name: string; timestamp: string };
  'task.updated': { taskId: string; status: string; timestamp: string };
  'automation.mode_changed': { mode: string; timestamp: string };
  'automation.problem_detected': { issueId: string; severity: string; timestamp: string };
};

export type HadesEventName = keyof HadesEventMap;

export class EventBus extends EventTarget {
  publish<K extends HadesEventName>(type: K, payload: HadesEventMap[K]): void {
    this.dispatchEvent(new CustomEvent(type, { detail: payload }));
  }

  subscribe<K extends HadesEventName>(type: K, listener: (payload: HadesEventMap[K]) => void): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<HadesEventMap[K]>;
      listener(customEvent.detail);
    };

    this.addEventListener(type, handler as EventListener);
    return () => this.removeEventListener(type, handler as EventListener);
  }
}

export const eventBus = new EventBus();
