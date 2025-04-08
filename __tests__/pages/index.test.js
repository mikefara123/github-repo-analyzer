import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../pages/index';
import '@testing-library/jest-dom';
import { AnalysisProvider } from '../../context/AnalysisContext';

// Mock the necessary components and utilities
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock axios for API calls
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock socket.io-client
jest.mock('socket.io-client', () => () => ({
  on: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Home Page', () => {
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });

  it('renders the home page with form', () => {
    render(
      <AnalysisProvider>
        <Home />
      </AnalysisProvider>
    );
    
    // Check for main elements
    expect(screen.getByRole('heading', { name: /github repository analyzer/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter github repository url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
  });

  it('validates repository URL input', async () => {
    render(
      <AnalysisProvider>
        <Home />
      </AnalysisProvider>
    );
    
    // Get form elements
    const input = screen.getByPlaceholderText(/enter github repository url/i);
    const submitButton = screen.getByRole('button', { name: /analyze/i });
    
    // Submit with empty URL
    fireEvent.click(submitButton);
    
    // Should show validation error
    expect(await screen.findByText(/please enter a valid github repository url/i)).toBeInTheDocument();
    
    // Enter invalid URL
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(submitButton);
    
    // Should still show validation error
    expect(await screen.findByText(/please enter a valid github repository url/i)).toBeInTheDocument();
    
    // Enter valid URL
    fireEvent.change(input, { target: { value: 'https://github.com/username/repo' } });
    fireEvent.click(submitButton);
    
    // Should not show validation error
    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid github repository url/i)).not.toBeInTheDocument();
    });
  });

  it('submits the form and initiates analysis', async () => {
    render(
      <AnalysisProvider>
        <Home />
      </AnalysisProvider>
    );
    
    // Get form elements
    const input = screen.getByPlaceholderText(/enter github repository url/i);
    const submitButton = screen.getByRole('button', { name: /analyze/i });
    
    // Enter valid URL
    fireEvent.change(input, { target: { value: 'https://github.com/username/repo' } });
    fireEvent.click(submitButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/analyzing repository/i)).toBeInTheDocument();
    });
  });
}); 