import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../Select';

vi.mock('lucide-react', () => ({
  __esModule: true,
  ChevronDown: (props) => <svg data-testid="chevron-icon" {...props} />,
  Check: (props) => <svg data-testid="check-icon" {...props} />,
  Search: (props) => <svg data-testid="search-icon" {...props} />,
  X: (props) => <svg data-testid="clear-icon" {...props} />,
}));

const OPTIONS = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
];

describe('Select', () => {
  it('allows picking an option and closing the menu', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Select
        options={OPTIONS}
        value=""
        placeholder="Select..."
        onChange={handleChange}
      />
    );

    const toggle = screen.getByRole('button');
    await user.click(toggle);
    await user.click(screen.getByText('Two'));

    expect(handleChange).toHaveBeenCalledWith('two');
  });

  it('filters options when searchable and no match exists', async () => {
    const user = userEvent.setup();

    render(
      <Select
        options={OPTIONS}
        value=""
        placeholder="Select..."
        searchable
      />
    );

    const toggle = screen.getByRole('button');
    await user.click(toggle);

    const searchBox = screen.getByPlaceholderText('Search options...');
    await user.type(searchBox, 'zzz');

    expect(screen.getByText('No options found')).toBeInTheDocument();
  });

  it('supports multiple selection and clearing the value', async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [value, setValue] = React.useState(['one']);
      return (
        <Select
          options={OPTIONS}
          value={value}
          multiple
          clearable
          onChange={setValue}
        />
      );
    };

    render(<Wrapper />);

    const toggle = screen.getByRole('button');
    expect(toggle.textContent).toContain('One');

    await user.click(toggle);
    await user.click(screen.getByText('Two'));

    await waitFor(() => {
      expect(toggle.textContent).toContain('2 items selected');
    });

    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find((btn) => btn !== toggle);
    expect(clearButton).toBeDefined();
    await user.click(clearButton);

    await waitFor(() => {
      expect(toggle.textContent).toContain('Select an option');
    });
  });
});
