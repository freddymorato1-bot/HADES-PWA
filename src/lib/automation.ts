export type Severity = 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';

export type Issue = {
  id: string;
  title: string;
  severity: Severity;
  summary: string;
  module: string;
};

export type Patch = {
  patch_id: string;
  created_at: string;
  reason: string;
  severity: Severity;
  affected_modules: string[];
  diff: {
    file: string;
    oldCode: string;
    newCode: string;
  }[];
  requires_confirmation: boolean;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  test_plan: string[];
  rollback_available: boolean;
  applied_at?: string;
  status?: 'PENDING_VERIFICATION' | 'STABLE' | 'REVERTED';
};

export function buildPatch(issue: Issue): Patch {
  return {
    patch_id: `patch-${issue.id}`,
    created_at: new Date().toISOString(),
    reason: `Resolve ${issue.title.toLowerCase()} in ${issue.module}.`,
    severity: issue.severity,
    affected_modules: [issue.module],
    diff: [
      {
        file: `workspace/${issue.module}/diagnostic.txt`,
        oldCode: 'status: pending\n',
        newCode: 'status: reviewed\n'
      }
    ],
    requires_confirmation: true,
    risk_level: issue.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
    test_plan: ['smoke-check', 'state-inspector', 'render-check'],
    rollback_available: true,
    status: 'PENDING_VERIFICATION'
  };
}
