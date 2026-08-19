import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom'; // Adds matchers like .toBeInTheDocument()
import SectionHeader from './SectionHeader';

describe('SectionHeader Component', () => {
  it('renders the title correctly', () => {
    // 1. Arrange & Act: Render the component
    render(<SectionHeader title="Scholarship Applications" />);
    
    // 2. Assert: Verify the text is on the screen
    expect(screen.getByText('Scholarship Applications')).toBeInTheDocument();
  });

  it('renders a button and fires the click handler when clicked', () => {
    // 1. Arrange: Create a fake "spy" function to track clicks
    const handleClick = vi.fn();
    
    // 2. Act: Render the component and click the button
    render(<SectionHeader title="Dashboard" buttonText="Click Me" onButtonClick={handleClick} />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    // 3. Assert: Verify our fake function was called exactly once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
