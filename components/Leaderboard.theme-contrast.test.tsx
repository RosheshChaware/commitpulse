import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';

import Leaderboard from './Leaderboard';

vi.mock('next/image', () => ({
  default: ({
    alt = '',
    src,
    fill: _fill,
    ...props
  }: ComponentProps<'img'> & { fill?: boolean }) => {
    void _fill;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} src={src || undefined} {...props} />
    );
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      whileInView: _whileInView,
      whileHover: _whileHover,
      whileTap: _whileTap,
      initial: _initial,
      animate: _animate,
      viewport: _viewport,
      transition: _transition,
      ...props
    }: HTMLAttributes<HTMLDivElement> & {
      children?: ReactNode;
      whileInView?: unknown;
      whileHover?: unknown;
      whileTap?: unknown;
      initial?: unknown;
      animate?: unknown;
      viewport?: unknown;
      transition?: unknown;
    }) => {
      void _whileInView;
      void _whileHover;
      void _whileTap;
      void _initial;
      void _animate;
      void _viewport;
      void _transition;
      return <div {...props}>{children}</div>;
    },
  },
}));

describe('Leaderboard theme contrast behavior', () => {
  const contributors = [
    {
      id: 1,
      login: 'alice',
      avatar_url: 'https://example.com/alice.png',
      contributions: 100,
      html_url: 'https://github.com/alice',
    },
    {
      id: 2,
      login: 'bob',
      avatar_url: 'https://example.com/bob.png',
      contributions: 90,
      html_url: 'https://github.com/bob',
    },
    {
      id: 3,
      login: 'charlie',
      avatar_url: 'https://example.com/charlie.png',
      contributions: 80,
      html_url: 'https://github.com/charlie',
    },
    {
      id: 4,
      login: 'david',
      avatar_url: 'https://example.com/david.png',
      contributions: 70,
      html_url: 'https://github.com/david',
    },
  ];

  it('renders leaderboard container', () => {
    const { container } = render(<Leaderboard contributors={contributors} />);

    expect(container.firstChild).toBeTruthy();
  });

  it('includes dark mode background classes', () => {
    const { container } = render(<Leaderboard contributors={contributors} />);

    expect(container.innerHTML).toContain('dark:bg');
  });

  it('includes dark mode text classes', () => {
    const { container } = render(<Leaderboard contributors={contributors} />);

    expect(container.innerHTML).toContain('dark:text-white');
  });

  it('includes dark mode border classes', () => {
    const { container } = render(<Leaderboard contributors={contributors} />);

    expect(container.innerHTML).toContain('dark:border');
  });

  it('includes hover contrast styling for both themes', () => {
    const { container } = render(<Leaderboard contributors={contributors} />);

    expect(container.innerHTML).toContain('dark:hover');
  });
});
