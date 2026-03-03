import type { Meta, StoryObj } from '@storybook/react';
import { Hologram } from './Hologram';

const meta = {
  title: 'Components/Hologram',
  component: Hologram,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['cyan', 'green', 'magenta', 'gold', 'rainbow'],
      description: 'Hologram color preset or custom CSS color',
    },
    intensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    scanlineSpeed: {
      control: { type: 'range', min: 1, max: 20, step: 0.5 },
    },
    flickerIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    chromaticAberration: {
      control: { type: 'range', min: 0, max: 5, step: 0.5 },
    },
    glitch: { control: 'boolean' },
    interactive: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Hologram>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */

/**
 * Default hologram with cyan color preset.
 * Move your mouse around to see the interactive effect.
 */
export const Default: Story = {
  args: {
    children: 'HOLOGRAM',
    style: { padding: '2rem 3rem', fontSize: '3rem', fontWeight: 700, letterSpacing: '0.15em' },
  },
};

/* ------------------------------------------------------------------ */

/**
 * A hologram with a background image. The image is automatically
 * converted to a holographic color palette using CSS filters.
 */
export const WithBackgroundImage: Story = {
  args: {
    backgroundImage: 'https://picsum.photos/seed/holo/800/400',
    color: 'cyan',
    children: (
      <div style={{ padding: '3rem 4rem', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '0.2em' }}>
          SYSTEM ONLINE
        </h2>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: 0.7, letterSpacing: '0.3em' }}>
          HOLOGRAPHIC INTERFACE v2.1
        </p>
      </div>
    ),
    style: { width: 600, minHeight: 200 },
  },
};

/* ------------------------------------------------------------------ */

/**
 * Comparison of all available color presets side by side.
 */
export const ColorPresets: Story = {
  args: { children: 'presets' },
  render: () => {
    const presets = ['cyan', 'green', 'magenta', 'gold', 'rainbow'] as const;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {presets.map((preset) => (
          <Hologram
            key={preset}
            color={preset}
            style={{
              padding: '1.5rem 2rem',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {preset}
          </Hologram>
        ))}
      </div>
    );
  },
};

/* ------------------------------------------------------------------ */

/**
 * Large cinematic heading — the kind you'd see floating in a
 * sci-fi control room.
 */
export const LargeDisplay: Story = {
  args: {
    color: 'cyan',
    intensity: 0.9,
    chromaticAberration: 3,
    children: (
      <div style={{ padding: '3rem 4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '0.2em' }}>
          NEXUS-7
        </div>
        <div
          style={{
            marginTop: '1rem',
            fontSize: '1rem',
            fontWeight: 400,
            letterSpacing: '0.5em',
            opacity: 0.6,
          }}
        >
          REPLICANT DETECTION SYSTEM
        </div>
      </div>
    ),
  },
};

/* ------------------------------------------------------------------ */

/**
 * Shows that the hologram container accepts arbitrary React content,
 * not just text.
 */
export const CustomContent: Story = {
  args: {
    color: 'green',
    children: (
      <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.8 }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          {'>'} SYSTEM STATUS
        </div>
        <div>CPU ............ 47%</div>
        <div>MEM ............ 2.1 GB / 8 GB</div>
        <div>NET ............ 142 Mbps ↑ 38 Mbps ↓</div>
        <div>DISK ........... 67% (412 GB free)</div>
        <div style={{ marginTop: '0.75rem', opacity: 0.6 }}>ALL SYSTEMS NOMINAL</div>
      </div>
    ),
    style: { minWidth: 360 },
  },
};

/* ------------------------------------------------------------------ */

/**
 * With a background image and the warm gold hologram preset.
 */
export const GoldWithBackground: Story = {
  args: {
    backgroundImage: 'https://picsum.photos/seed/temple/800/400',
    color: 'gold',
    intensity: 0.8,
    children: (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '0.15em' }}>
          ARCHIVE
        </h2>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', letterSpacing: '0.35em', opacity: 0.7 }}>
          CLASSIFIED RECORDS
        </p>
      </div>
    ),
    style: { width: 500, minHeight: 180 },
  },
};

/* ------------------------------------------------------------------ */

/**
 * Static hologram with all interactive/animated effects disabled.
 * Useful as a baseline for visual comparison.
 */
export const Static: Story = {
  args: {
    interactive: false,
    glitch: false,
    flickerIntensity: 0,
    children: 'STATIC',
    style: { padding: '2rem 3rem', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '0.15em' },
  },
};

/* ------------------------------------------------------------------ */

/**
 * Rainbow iridescent preset — cycles through the full spectrum.
 */
export const Rainbow: Story = {
  args: {
    color: 'rainbow',
    backgroundImage: 'https://picsum.photos/seed/abstract/800/400',
    intensity: 0.85,
    children: (
      <div style={{ padding: '3rem 4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '0.25em' }}>PRISM</div>
        <div style={{ fontSize: '0.8rem', letterSpacing: '0.4em', marginTop: '0.5rem', opacity: 0.7 }}>
          IRIDESCENT MODE
        </div>
      </div>
    ),
    style: { width: 500 },
  },
};
