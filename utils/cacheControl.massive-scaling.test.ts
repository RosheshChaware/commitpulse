import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { buildCacheControlHeader } from './cacheControl';
import '@testing-library/jest-dom/vitest';

interface ContributorAction {
  id: number;
  username: string;
  count: number;
}

const CacheControlMassiveScalingLayout = ({
  actions,
  cacheInput,
}: {
  actions: ContributorAction[];
  cacheInput: Parameters<typeof buildCacheControlHeader>[0];
}) => {
  const header = buildCacheControlHeader(cacheInput);

  // Render an SVG visualization of the scaling cache nodes
  const svgElements = actions.slice(0, 100).map((action, i) => {
    const rawVal =
      typeof cacheInput.secondsToMidnight === 'number' ? cacheInput.secondsToMidnight : 3600;
    // Scale cy cleanly using secondsToMidnight metric
    const scaleFactor = rawVal !== 0 ? Math.min(10, Math.abs(rawVal) / 1000) : 1;
    const cy = Math.max(0, Math.min(300, (action.count * scaleFactor) % 300));
    const cx = (i * 3) % 400;

    return React.createElement('circle', {
      key: action.id,
      cx,
      cy,
      r: 2,
      fill: 'red',
      'data-testid': 'svg-point',
    });
  });

  const svgContainer = React.createElement(
    'svg',
    {
      width: 400,
      height: 300,
      viewBox: '0 0 400 300',
      'data-testid': 'scaling-svg',
    },
    svgElements
  );

  // Render CSS Grid items for listings
  const gridItems = actions.map((action) =>
    React.createElement(
      'div',
      {
        key: action.id,
        className: 'grid-item p-2 border border-gray-200',
        'data-testid': 'grid-item',
        style: {
          position: 'relative',
        },
      },
      React.createElement('span', null, action.username),
      React.createElement('span', null, ` - ${action.count} contributions`)
    )
  );

  const gridContainer = React.createElement(
    'div',
    {
      className: 'grid grid-cols-4 gap-4',
      'data-testid': 'grid-container',
    },
    gridItems
  );

  return React.createElement(
    'div',
    { className: 'container mx-auto p-4' },
    React.createElement('h1', null, 'Cache Control Massive Listing'),
    React.createElement(
      'div',
      {
        'data-testid': 'cache-header-display',
        className: 'max-w-xs break-all bg-gray-100 p-2 rounded',
      },
      header
    ),
    svgContainer,
    gridContainer
  );
};

describe('buildCacheControlHeader - Massive Data Sets & Extreme High Bounds Scaling', () => {
  const generateMockActions = (count: number): ContributorAction[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      username: `Contributor_${i}`,
      count: (i * 7) % 500,
    }));
  };

  it('1. renders a loaded configuration layout with 1000+ mock contributor actions without crashing', () => {
    const actions = generateMockActions(1000);

    const { container } = render(
      React.createElement(CacheControlMassiveScalingLayout, {
        actions,
        cacheInput: { bypass: true },
      })
    );

    const display = screen.getByTestId('cache-header-display');
    expect(display).toHaveTextContent('no-cache, no-store, must-revalidate');

    // Use container.querySelectorAll for high-volume count to avoid heavy JSDOM performance penalty
    const gridItems = container.querySelectorAll('.grid-item');
    expect(gridItems.length).toBe(1000);
  });

  it('2. runs calculations and rendering within strict execution performance margins under high load', () => {
    const loops = 20000;
    const actions = generateMockActions(1000);

    const startCalc = performance.now();
    for (let i = 0; i < loops; i++) {
      buildCacheControlHeader({ secondsToMidnight: i % 86400 });
      buildCacheControlHeader({ bypass: i % 2 === 0 });
      buildCacheControlHeader({ isHistoricalYear: i % 3 === 0 });
    }
    const endCalc = performance.now();
    const elapsedCalc = endCalc - startCalc;

    // Direct performance calculation should take very little time
    const calcLimit = process.env.CI ? 5000 : 500;
    expect(elapsedCalc).toBeLessThan(calcLimit);

    const startRender = performance.now();
    render(
      React.createElement(CacheControlMassiveScalingLayout, {
        actions,
        cacheInput: { secondsToMidnight: 43200 },
      })
    );
    const endRender = performance.now();
    const elapsedRender = endRender - startRender;

    // Component render with 1000 items should complete well within acceptable margins
    const renderLimit = process.env.CI ? 10000 : 1000;
    expect(elapsedRender).toBeLessThan(renderLimit);
  });

  it('3. scales SVG coordinates cleanly without overflows or NaN under extreme input bounds', () => {
    const actions = generateMockActions(100);
    const extremeInputs = [
      { secondsToMidnight: 1_000_000_000 }, // Extremely large high bound
      { secondsToMidnight: -86400 }, // Negative bounds
      { secondsToMidnight: 0 }, // Zero bound
    ];

    extremeInputs.forEach((cacheInput) => {
      const { container, unmount } = render(
        React.createElement(CacheControlMassiveScalingLayout, {
          actions,
          cacheInput,
        })
      );

      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBe(100);

      circles.forEach((circle) => {
        const cx = parseFloat(circle.getAttribute('cx') || '');
        const cy = parseFloat(circle.getAttribute('cy') || '');

        expect(Number.isNaN(cx)).toBe(false);
        expect(Number.isNaN(cy)).toBe(false);
        expect(Number.isFinite(cx)).toBe(true);
        expect(Number.isFinite(cy)).toBe(true);

        // Coordinates should scale cleanly within viewBox limits (0 to 400 for width, 0 to 300 for height)
        expect(cx).toBeGreaterThanOrEqual(0);
        expect(cx).toBeLessThan(400);
        expect(cy).toBeGreaterThanOrEqual(0);
        expect(cy).toBeLessThanOrEqual(300);
      });

      unmount();
    });
  });

  it('4. applies correct styling classes to guarantee text wrapping and avoid layout overflow', () => {
    const actions = generateMockActions(10);

    render(
      React.createElement(CacheControlMassiveScalingLayout, {
        actions,
        cacheInput: { secondsToMidnight: 86400 },
      })
    );

    const display = screen.getByTestId('cache-header-display');
    const classList = display.className.split(' ');

    // Must preserve layout limits classes for the cache header strings to hold text wrapping correctly
    expect(classList).toContain('max-w-xs');
    expect(classList).toContain('break-all');
  });

  it('5. renders grid listing items successfully without breaking layout structures', () => {
    const actions = generateMockActions(500);

    const { container } = render(
      React.createElement(CacheControlMassiveScalingLayout, {
        actions,
        cacheInput: { isHistoricalYear: true },
      })
    );

    const gridContainer = screen.getByTestId('grid-container');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer.className).toContain('grid');
    expect(gridContainer.className).toContain('grid-cols-4');

    const gridItems = container.querySelectorAll('.grid-item');
    expect(gridItems.length).toBe(500);

    // Make sure they have key elements rendered and structurally sound
    gridItems.forEach((item) => {
      expect(item.querySelector('span')).toBeInTheDocument();
    });
  });
});
