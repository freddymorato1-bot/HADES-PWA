import { describe, expect, it } from 'vitest';
import { checkPolicy } from './policy';

describe('Policy Engine foundation', () => {
  it('denies prohibited execution tools', () => {
    const result = checkPolicy('eval_any_code', 'app://automation/patch', { risk: 'LOW', requiresConfirmation: false });
    expect(result.allowed).toBe(false);
    expect(result.authorizationLevel).toBe('L4');
  });

  it('denies destinations outside the local allowlist', () => {
    const result = checkPolicy('open_url', 'https://example.com', { risk: 'LOW', requiresConfirmation: false });
    expect(result.allowed).toBe(false);
    expect(result.authorizationLevel).toBe('L4');
  });

  it('requires L3 confirmation for a local patch', () => {
    const result = checkPolicy('automation.patch', 'app://automation/patch', { risk: 'MEDIUM', requiresConfirmation: true });
    expect(result.allowed).toBe(true);
    expect(result.authorizationLevel).toBe('L3');
  });

  it('blocks high-risk patches in the foundation', () => {
    const result = checkPolicy('automation.patch', 'app://automation/patch', { risk: 'HIGH', requiresConfirmation: true });
    expect(result.allowed).toBe(false);
    expect(result.authorizationLevel).toBe('L4');
  });
});
