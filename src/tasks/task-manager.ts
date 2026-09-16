export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus =
  | 'QUEUED'
  | 'PLANNING'
  | 'WAITING_CONFIRMATION'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'RETRYING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

export type HadesTask = {
  task_id: string;
  correlation_id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  permissions: string[];
  language: 'es' | 'en';
  progress: number;
  result?: string;
  error?: string;
  retry_count: number;
  allowed_tools: string[];
  allowed_resources: string[];
  allowed_destinations: string[];
  max_duration: number;
  max_steps: number;
  expires_at?: string;
  requires_confirmation_for: string[];
};

export class TaskManager {
  private tasks = new Map<string, HadesTask>();

  createTask(input: Omit<HadesTask, 'task_id' | 'created_at' | 'status' | 'retry_count' | 'progress'> & { task_id?: string }): HadesTask {
    const task_id = input.task_id ?? `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const task: HadesTask = {
      ...input,
      task_id,
      status: 'QUEUED',
      created_at: new Date().toISOString(),
      progress: 0,
      retry_count: 0
    };

    this.tasks.set(task_id, task);
    return task;
  }

  updateTask(task_id: string, patch: Partial<HadesTask>): HadesTask | undefined {
    const current = this.tasks.get(task_id);
    if (!current) return undefined;

    const next = { ...current, ...patch };
    this.tasks.set(task_id, next);
    return next;
  }

  getTask(task_id: string): HadesTask | undefined {
    return this.tasks.get(task_id);
  }

  getAll(): HadesTask[] {
    return Array.from(this.tasks.values());
  }
}

export const taskManager = new TaskManager();
