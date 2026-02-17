import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// 1. THE FAVICON GENERATOR
export default function Icon() {
  return new ImageResponse(
    (
      // Container (Gradient Border)
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #d4ff00, #a6cc00)', // The Sage Gradient
          borderRadius: '6px', // Scaled radius
        }}
      >
        {/* Inner Depth Layer (The Black Box) */}
        <div
          style={{
            width: '28px', // 2px inset on each side
            height: '28px',
            background: '#0a0a0a',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* The 0 */}
          <div
            style={{
              color: '#d4ff00', // Sage
              fontSize: '20px',
              fontFamily: 'monospace', // Matches font-mono
              fontWeight: 900,
              marginTop: '-2px', // Optical alignment
            }}
          >
            0
          </div>

          {/* Precision Slash */}
          <div
            style={{
              position: 'absolute',
              width: '140%',
              height: '2px',
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.8), transparent)',
              transform: 'rotate(-38deg)',
              top: '13px', // Center manually for simple shapes
              left: '-20%',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}