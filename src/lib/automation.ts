export type PolicyDecision = {
  allowed: boolean;
  reason: string;
  scope: string;
  authorizationLevel: 'L1' | 'L2' | 'L3' | 'L4';
};

export function checkPolicy(
  tool: string,
  destination: string,
  options: { risk: 'LOW' | 'MEDIUM' | 'HIGH'; requiresConfirmation: boolean }
): PolicyDecision {
  const isAllowedDestination = destination.startsWith('app://') || destination.startsWith('local://');
  const isSafeTool = tool !== 'eval_any_code' && tool !== 'execute_arbitrary_js' && tool !== 'fetch_any_url';

  if (!isSafeTool) {
    return {
      allowed: false,
      reason: 'Prohibited tool blocked by Policy Engine.',
      scope: 'deny',
      authorizationLevel: 'L4'
    };
  }

  if (!isAllowedDestination) {
    return {
      allowed: false,
      reason: 'Remote or unapproved destination is outside the allowlist.',
      scope: 'deny',
      authorizationLevel: 'L4'
    };
  }

  if (options.risk === 'HIGH' || options.requiresConfirmation) {
    return {
      allowed: true,
      reason: 'Authorization requires explicit confirmation before execution.',
      scope: 'restricted',
      authorizationLevel: 'L3'
    };
  }

  return {
    allowed: true,
    reason: 'Tool is within scope and safe to execute.',
    scope: 'approved',
    authorizationLevel: 'L1'
  };
}
