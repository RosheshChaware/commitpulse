import { render } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Leaderboard, { type Contributor } from './Leaderboard';

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
    }: ComponentProps<'div'> & {
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

const contributors: Contributor[] = [
  {
    id: 1,
    login: 'alice',
    avatar_url: '/avatar.png',
    contributions: 100,
    html_url: 'https://github.com/alice',
  },
];

describe('Leaderboard error resilience', () => {
  it('renders without crashing with valid contributor data', () => {
    expect(() => render(<Leaderboard contributors={contributors} />)).not.toThrow();
  });

  it('renders safely with an empty contributor array', () => {
    expect(() => render(<Leaderboard contributors={[]} />)).not.toThrow();
  });

  it('maintains stable hydration-safe rendering for empty state', () => {
    const { container } = render(<Leaderboard contributors={[]} />);

    expect(container).toBeTruthy();
    expect(container.firstChild).not.toBeNull();
  });

  it('does not throw when contributor list contains minimal values', () => {
    const minimalContributors: Contributor[] = [
      {
        id: 1,
        login: '',
        avatar_url: '',
        contributions: 0,
        html_url: '',
      },
    ];

    expect(() => render(<Leaderboard contributors={minimalContributors} />)).not.toThrow();
  });

  it('survives repeated renders without runtime exceptions', () => {
    const { rerender } = render(<Leaderboard contributors={contributors} />);

    expect(() => rerender(<Leaderboard contributors={contributors} />)).not.toThrow();
  });
});
