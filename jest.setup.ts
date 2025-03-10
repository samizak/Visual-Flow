import '@testing-library/jest-dom';

// Mock any browser APIs that Jest doesn't provide
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));