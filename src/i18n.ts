export type Patch = {
  patch_id: string;
  created_at: string;
  reason: string;
  severity: 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';
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
};

export type Issue = {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';
  summary: string;
  module: string;
};

export function buildPatch(issue: Issue): Patch {
  return {
    patch_id: `patch-${issue.id}`,
    created_at: new Date().toISOString(),
    reason: `Resolve ${issue.title.toLowerCase()} in ${issue.module}.`,
    severity: issue.severity,
    affected_modules: [issue.module, 'automation'],
    diff: [
      {
        file: 'src/lib/automation.ts',
        oldCode: 'const pending = true;\nreturn issue;\n',
        newCode: 'const pending = false;\nreturn issue;\n',
      }
    ],
    requires_confirmation: true,
    risk_level: issue.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
    test_plan: ['smoke-check', 'state-inspector', 'render-check'],
    rollback_available: true
  };
}

export function getDefaultPolicyResult() {
  return {
    allowed: true,
    reason: 'Default policy: local scope on app internals only.',
    scope: 'approved',
    authorizationLevel: 'L1'
  };
}
