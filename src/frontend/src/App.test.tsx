import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App Layout', () => {
  it('renders the Lawyer Dashboard successfully', () => {
    const { getByText } = render(<App />);
    expect(getByText('Lawyer Dashboard')).toBeInTheDocument();
    expect(getByText('Expert AI Counsel')).toBeInTheDocument();
    expect(getByText('Case Files')).toBeInTheDocument();
  });
});
