import type { Meta, StoryObj } from '@storybook/react';
import { Hologram } from './Hologram';

const meta = {
  title: 'Components/Hologram',
  component: Hologram,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['foil', 'beam'],
      description: 'Visual variant: realistic foil or sci-fi beam',
    },
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

/* ==================================================================
   FOIL VARIANT — realistic holographic material
   ================================================================== */

/**
 * **Default foil hologram (rainbow).** The surface shows a full-spectrum
 * rainbow diffraction pattern with a chrome metallic base. Move your mouse
 * to see the rainbow shift and the specular highlight follow.
 */
export const FoilDefault: Story = {
  args: {
    variant: 'foil',
    color: 'rainbow',
    children: (
      <div style={{ padding: '2rem 3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.2em' }}>
          HOLOGRAM
        </div>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.4em', marginTop: '0.3rem', opacity: 0.7 }}>
          AUTHENTIC PRODUCT
        </div>
      </div>
    ),
  },
};

/* ------------------------------------------------------------------ */

/**
 * **Foil with a background image.** The image is blended onto the foil via
 * `mix-blend-mode: multiply` — dark areas "print" onto the surface, light
 * areas reveal the rainbow foil underneath. This matches how real holographic
 * stickers are manufactured.
 */
export const FoilWithImage: Story = {
  args: {
    variant: 'foil',
    color: 'rainbow',
    backgroundImage: 'https://picsum.photos/seed/holo/800/400',
    children: (
      <div style={{ padding: '3rem 4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.2em' }}>
          VERIFIED
        </div>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.4em', marginTop: '0.3rem', opacity: 0.7 }}>
          SECURITY LABEL
        </div>
      </div>
    ),
    style: { width: 500, minHeight: 180 },
  },
};

/* ------------------------------------------------------------------ */

/**
 * **All foil color presets side by side.** Each preset biases the rainbow
 * spectrum toward a particular hue family and sets the metallic base tone.
 */
export const FoilColorPresets: Story = {
  args: { children: 'presets' },
  render: () => {
    const presets = ['rainbow', 'cyan', 'green', 'magenta', 'gold'] as const;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {presets.map((preset) => (
          <Hologram
            key={preset}
            variant="foil"
            color={preset}
            style={{
              padding: '1.5rem 2rem',
              fontSize: '1.3rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
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
 * **Gold foil preset.** Warm brass metallic base with gold-biased rainbow.
 * Reminiscent of premium holographic seals.
 */
export const FoilGold: Story = {
  args: {
    variant: 'foil',
    color: 'gold',
    children: (
      <div style={{ padding: '2.5rem 3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.15em' }}>
          PREMIUM
        </div>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.35em', marginTop: '0.3rem', opacity: 0.7 }}>
          CERTIFICATE OF AUTHENTICITY
        </div>
      </div>
    ),
  },
};

/* ==================================================================
   BEAM VARIANT — sci-fi projected hologram
   ================================================================== */

/**
 * **Default beam hologram (cyan).** Glowing text with chromatic aberration,
 * scanlines, and edge bloom. The classic sci-fi projected-hologram look.
 */
export const BeamDefault: Story = {
  args: {
    variant: 'beam',
    color: 'cyan',
    children: 'HOLOGRAM',
    style: { padding: '2rem 3rem', fontSize: '3rem', fontWeight: 700, letterSpacing: '0.15em' },
  },
};

/* ------------------------------------------------------------------ */

/**
 * **Beam with a background image.** The image is re-graded to a
 * monochromatic holographic palette via CSS filters.
 */
export const BeamWithImage: Story = {
  args: {
    variant: 'beam',
    color: 'cyan',
    backgroundImage: 'https://picsum.photos/seed/holo/800/400',
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
 * **Beam — large cinematic heading.** High intensity with strong
 * chromatic aberration for maximum visual impact.
 */
export const BeamLargeDisplay: Story = {
  args: {
    variant: 'beam',
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
 * **Beam — green terminal readout.** Custom content demonstrating that
 * the hologram container accepts arbitrary React nodes.
 */
export const BeamTerminal: Story = {
  args: {
    variant: 'beam',
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
 * **Beam — rainbow preset.** Full-spectrum iridescent text with animated
 * rainbow gradient.
 */
export const BeamRainbow: Story = {
  args: {
    variant: 'beam',
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
