import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('HADES foundation UI', () => {
  it('renders the HADES shell and automation panel', () => {
    render(<App />);
    expect(screen.getByText('HADES')).toBeTruthy();
    expect(screen.getByText('Problemas detectados')).toBeTruthy();
  });

  it('starts with microphone listening disabled', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Micrófono inactivo' })).toBeTruthy();
  });
});
