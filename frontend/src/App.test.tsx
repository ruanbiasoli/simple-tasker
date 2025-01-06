import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main title and add button', () => {
  render(<App />);
  const titleElement = screen.getByText(/Simple Tasker/i);
  const addButton = screen.getByText(/Adicionar/i);

  expect(titleElement).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();
});
