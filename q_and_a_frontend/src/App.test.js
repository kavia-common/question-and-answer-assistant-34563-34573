import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders title and submit button', () => {
  render(<App />);
  expect(screen.getByText(/Q&A Assistant/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Ask/i })).toBeInTheDocument();
});

test('shows validation error on empty submit', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Ask/i }));
  expect(screen.getByRole('alert')).toBeInTheDocument();
});
