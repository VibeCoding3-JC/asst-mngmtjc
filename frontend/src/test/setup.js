import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver properly as a class
class ResizeObserverMock {
    constructor(callback) {
        this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;
window.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver
class IntersectionObserverMock {
    constructor(callback) {
        this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
}
global.IntersectionObserver = IntersectionObserverMock;

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock scrollTo
window.scrollTo = vi.fn();

// Suppress console errors for expected test failures
const originalError = console.error;
console.error = (...args) => {
    if (
        typeof args[0] === 'string' &&
        (args[0].includes('Warning: ReactDOM.render') ||
         args[0].includes('act(...)'))
    ) {
        return;
    }
    originalError.call(console, ...args);
};
