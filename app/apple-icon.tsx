import { ImageResponse } from 'next/og';

// Apple recommends 180x180
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      // Container
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #d4ff00, #a6cc00)',
          borderRadius: '36px', // Proportional radius for 180px
        }}
      >
        {/* Inner Depth Layer */}
        <div
          style={{
            width: '172px', // 4px border roughly
            height: '172px',
            background: '#0a0a0a',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)', // Extra depth for mobile icon
          }}
        >
          {/* The 0 */}
          <div
            style={{
              color: '#d4ff00',
              fontSize: '110px',
              fontFamily: 'monospace',
              fontWeight: 900,
              marginTop: '-10px',
            }}
          >
            0
          </div>

          {/* Precision Slash */}
          <div
            style={{
              position: 'absolute',
              width: '140%',
              height: '8px', // Thicker slash for larger size
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.9), transparent)',
              transform: 'rotate(-38deg)',
            }}
          />
          
          {/* Specular Highlight (The "Glass" feel) */}
          <div 
             style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
                borderRadius: '32px 32px 0 0',
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