import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from './App';

test('renders Splash screen title', () => {
  render(
    <HashRouter>
      <App />
    </HashRouter>
  );
  const heading = screen.getByText(/MyTV/i);
  expect(heading).toBeInTheDocument();
});
