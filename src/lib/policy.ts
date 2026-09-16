export type PolicyDecision = {
  allowed: boolean;
  reason: string;
  scope: string;
  authorizationLevel: 'L1' | 'L2' | 'L3' | 'L4';
};

const blockedTools = new Set(['eval_any_code', 'execute_arbitrary_js', 'fetch_any_url']);

export function checkPolicy(
  tool: string,
  destination: string,
  options: { risk: 'LOW' | 'MEDIUM' | 'HIGH'; requiresConfirmation: boolean }
): PolicyDecision {
  if (blockedTools.has(tool)) {
    return {
      allowed: false,
      reason: 'Prohibited tool blocked by Policy Engine.',
      scope: 'deny',
      authorizationLevel: 'L4'
    };
  }

  if (!destination.startsWith('app://') && !destination.startsWith('local://')) {
    return {
      allowed: false,
      reason: 'Destination is outside the local allowlist.',
      scope: 'deny',
      authorizationLevel: 'L4'
    };
  }

  if (options.risk === 'HIGH') {
    return {
      allowed: false,
      reason: 'High-risk patches are blocked from this foundation.',
      scope: 'deny',
      authorizationLevel: 'L4'
    };
  }

  if (options.requiresConfirmation) {
    return {
      allowed: true,
      reason: 'Explicit confirmation is required before execution.',
      scope: 'restricted',
      authorizationLevel: 'L3'
    };
  }

  return {
    allowed: true,
    reason: 'Request is within the local approved scope.',
    scope: 'approved',
    authorizationLevel: 'L1'
  };
}
