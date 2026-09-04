import React from 'react';
import { CharacterConfig } from '../../types';

interface ModularCharacterProps {
  config: CharacterConfig;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const ModularCharacter: React.FC<ModularCharacterProps> = ({
  config,
  size = 'md',
  className = '',
  animate = true,
}) => {
  // Compute pixel dimensions
  let pxSize = 140;
  if (typeof size === 'number') {
    pxSize = size;
  } else {
    switch (size) {
      case 'sm': pxSize = 48; break;
      case 'md': pxSize = 110; break;
      case 'lg': pxSize = 180; break;
      case 'xl': pxSize = 280; break;
    }
  }

  const safeConfig = config || {
    gender: 'man',
    skinTone: '#F0C08A',
    hairStyle: 'fade',
    hairColor: '#1E293B',
    outfit: 'hoodie',
    outfitColor: '#6366F1',
    hat: 'none',
    glasses: 'none',
    accessory: 'none',
    pet: 'none',
    background: 'default',
    expression: 'idle',
  };

  const {
    gender = 'man',
    skinTone = '#F0C08A',
    hairStyle = 'fade',
    hairColor = '#1E293B',
    outfit = 'hoodie',
    outfitColor = '#6366F1',
    hat = 'none',
    glasses = 'none',
    accessory = 'none',
    pet = 'none',
    background = 'default',
    expression = 'idle',
  } = safeConfig;

  const isMan = gender === 'man';

  // Eye & Mouth coordinates based on expression and gender
  const renderMouth = () => {
    if (!isMan) {
      // WOMAN: Soft, delicate, clearly feminine lip line with natural rosy tint
      switch (expression) {
        case 'happy':
        case 'victory':
          return (
            <g>
              <path d="M 91 123 Q 100 134 109 123" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" fill="#FDA4AF" />
              <path d="M 93 123 Q 100 127 107 123" stroke="#BE123C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </g>
          );
        case 'thinking':
          return (
            <path d="M 92 124 Q 100 120 108 124" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" fill="none" />
          );
        case 'oops':
          return (
            <ellipse cx="100" cy="124" rx="4" ry="5" fill="#E11D48" />
          );
        case 'idle':
      default:
          return (
            <path d="M 92 123 Q 100 129 108 123" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          );
      }
    } else {
      // MAN: Confident, clean, youthful athletic mouth line
      switch (expression) {
        case 'happy':
        case 'victory':
          return <path d="M 91 123 Q 100 131 109 123" stroke="#372416" strokeWidth="2.2" strokeLinecap="round" fill="#DC2626" />;
        case 'thinking':
          return <path d="M 91 124 Q 100 120 109 124" stroke="#372416" strokeWidth="2" strokeLinecap="round" fill="none" />;
        case 'oops':
          return <ellipse cx="100" cy="124" rx="4" ry="5.5" fill="#372416" />;
        case 'idle':
        default:
          return <path d="M 92 123 Q 100 128 108 123" stroke="#372416" strokeWidth="2" strokeLinecap="round" fill="none" />;
      }
    }
  };

  const renderEyes = () => {
    if (!isMan) {
      // WOMAN: Soft feminine eyes with delicate eyelashes & rosy cheeks
      if (expression === 'happy' || expression === 'victory') {
        return (
          <g>
            <path d="M 80 97 Q 86 90 92 97" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 92 95 L 95 91" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
            
            <path d="M 108 97 Q 114 90 120 97" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 120 95 L 123 91" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />

            {/* Rosy blush */}
            <circle cx="77" cy="104" r="4.5" fill="#FB7185" opacity="0.4" />
            <circle cx="123" cy="104" r="4.5" fill="#FB7185" opacity="0.4" />
          </g>
        );
      }

      return (
        <g>
          {/* Left Eye */}
          <circle cx="86" cy="96" r="5" fill="#0F172A" />
          <circle cx="87.5" cy="94.5" r="1.8" fill="#FFFFFF" />
          {/* Eyelashes */}
          <path d="M 89 93 L 93 90" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 83 93 L 81 90" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Right Eye */}
          <circle cx="114" cy="96" r="5" fill="#0F172A" />
          <circle cx="115.5" cy="94.5" r="1.8" fill="#FFFFFF" />
          {/* Eyelashes */}
          <path d="M 117 93 L 121 90" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 111 93 L 109 90" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Rosy blush */}
          <circle cx="77" cy="104" r="4.5" fill="#FB7185" opacity="0.4" />
          <circle cx="123" cy="104" r="4.5" fill="#FB7185" opacity="0.4" />
        </g>
      );
    }

    // MAN EYES: Athletic, clear, handsome gaze
    if (expression === 'happy' || expression === 'victory') {
      return (
        <g>
          <path d="M 81 97 Q 87 91 93 97" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 107 97 Q 113 91 119 97" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    return (
      <g>
        <circle cx="87" cy="96" r="4.8" fill="#0F172A" />
        <circle cx="88.2" cy="94.5" r="1.6" fill="#FFFFFF" />
        <circle cx="113" cy="96" r="4.8" fill="#0F172A" />
        <circle cx="114.2" cy="94.5" r="1.6" fill="#FFFFFF" />
      </g>
    );
  };

  const renderEyebrows = () => {
    if (!isMan) {
      // WOMAN: Soft, arched, elegant eyebrows
      if (expression === 'thinking') {
        return (
          <g stroke={hairColor} strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M 78 84 Q 85 80 93 85" />
            <path d="M 107 85 Q 115 79 122 82" />
          </g>
        );
      }
      return (
        <g stroke={hairColor} strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M 78 83 Q 86 79 93 83" />
          <path d="M 107 83 Q 114 79 122 83" />
        </g>
      );
    }

    // MAN: Clean, athletic, handsome eyebrows
    if (expression === 'thinking') {
      return (
        <g stroke={hairColor} strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M 78 84 Q 86 80 94 85" />
          <path d="M 106 86 Q 114 80 122 83" />
        </g>
      );
    }
    return (
      <g stroke={hairColor} strokeWidth="2.8" strokeLinecap="round" fill="none">
        <path d="M 78 83 Q 86 79 94 83" />
        <path d="M 106 83 Q 114 79 122 83" />
      </g>
    );
  };

  // Hair Render
  const renderHair = () => {
    switch (hairStyle) {
      case 'fade':
        return (
          <g fill={hairColor}>
            <path d="M 68 85 C 68 50, 132 50, 132 85 C 132 95, 136 70, 125 55 C 110 40, 90 40, 75 55 C 64 70, 68 95, 68 85 Z" />
            <ellipse cx="100" cy="62" rx="32" ry="18" />
          </g>
        );
      case 'curly_top':
        return (
          <g fill={hairColor}>
            <circle cx="78" cy="58" r="14" />
            <circle cx="95" cy="50" r="15" />
            <circle cx="112" cy="52" r="14" />
            <circle cx="122" cy="64" r="13" />
            <circle cx="73" cy="72" r="12" />
            <circle cx="102" cy="62" r="15" />
          </g>
        );
      case 'side_sweep':
        return (
          <g fill={hairColor}>
            <path d="M 66 85 C 66 48, 134 45, 136 85 C 130 60, 115 50, 95 50 C 70 50, 62 70, 60 90 Z" />
            <path d="M 65 65 Q 95 40 135 60 Q 110 85 75 75 Z" />
          </g>
        );
      case 'ponytail':
        return (
          <g fill={hairColor}>
            {/* Back high ponytail */}
            <path d="M 124 58 Q 158 72 150 120 Q 138 102 126 85 Z" />
            {/* Top crown */}
            <ellipse cx="100" cy="60" rx="34" ry="22" />
            {/* Front soft bangs */}
            <path d="M 68 76 Q 85 62 105 66 Q 80 50 68 76 Z" />
            {/* Hair tie */}
            <circle cx="126" cy="60" r="4.5" fill="#F43F5E" />
          </g>
        );
      case 'wavy_bob':
        return (
          <g fill={hairColor}>
            <ellipse cx="100" cy="58" rx="36" ry="24" />
            {/* Left waves framing face */}
            <path d="M 66 75 C 53 90, 52 130, 72 130 C 62 112, 66 85, 72 75 Z" />
            {/* Right waves framing face */}
            <path d="M 134 75 C 147 90, 148 130, 128 130 C 138 112, 134 85, 128 75 Z" />
          </g>
        );
      case 'braids':
        return (
          <g fill={hairColor}>
            <ellipse cx="100" cy="58" rx="33" ry="18" />
            {/* Left Braid */}
            <circle cx="64" cy="90" r="8" />
            <circle cx="62" cy="106" r="7" />
            <circle cx="60" cy="122" r="6" />
            <circle cx="59" cy="135" r="4" fill="#F59E0B" />
            {/* Right Braid */}
            <circle cx="136" cy="90" r="8" />
            <circle cx="138" cy="106" r="7" />
            <circle cx="140" cy="122" r="6" />
            <circle cx="141" cy="135" r="4" fill="#F59E0B" />
          </g>
        );
      case 'afro':
        return (
          <g fill={hairColor}>
            <circle cx="100" cy="62" r="42" />
          </g>
        );
      default:
        return <ellipse cx="100" cy="62" rx="32" ry="18" fill={hairColor} />;
    }
  };


  // Arms Render: Graceful, slightly narrower proportional limbs to the belly
  const renderArms = () => {
    const isSleeveless = !isMan && (outfit === 'dress' || outfit === 'summer_top');
    const isShortSleeve = isMan && (outfit === 'casual_tee');
    const isKimono = !isMan && outfit === 'kimono';
    const isVarsity = isMan && outfit === 'varsity';
    const isBiker = outfit === 'leather_biker';
    const isCyber = outfit === 'cyber_jacket';
    const isTracksuit = outfit === 'tracksuit';

    let sleeveColor: string = outfitColor;
    if (isVarsity) sleeveColor = '#F8FAFC';
    if (isBiker) sleeveColor = '#1E293B';
    if (isCyber) sleeveColor = '#0F172A';

    if (!isMan) {
      // -----------------------------------------------------------
      // FEMALE ARMS: Narrower, elegant, proportional to waist
      // -----------------------------------------------------------
      if (isKimono) {
        return (
          <g id="character-arms-woman-kimono">
            {/* Wide flowing traditional kimono sleeves to the belly line */}
            <path 
              d="M 66 148 C 42 158, 38 180, 40 200 L 64 200 C 62 178, 64 162, 70 154 Z" 
              fill="#FCE7F3" 
              stroke={outfitColor} 
              strokeWidth="1.5" 
            />
            <path 
              d="M 134 148 C 158 158, 162 180, 160 200 L 136 200 C 138 178, 136 162, 130 154 Z" 
              fill="#FCE7F3" 
              stroke={outfitColor} 
              strokeWidth="1.5" 
            />
          </g>
        );
      }

      return (
        <g id="character-arms-woman">
          {/* Left Arm: Slightly narrower, elegant curve to belly */}
          <path 
            d="M 66 150 C 52 156, 48 174, 49 200 L 63 200 C 62 180, 64 164, 69 154 Z" 
            fill={isSleeveless ? skinTone : sleeveColor} 
          />
          {/* Left Arm Inner Seam Shadow */}
          <path 
            d="M 69 154 C 64 166, 62 182, 63 200" 
            stroke="#000000" 
            strokeWidth="1.2" 
            strokeOpacity="0.18" 
            fill="none" 
          />

          {/* Right Arm: Slightly narrower, elegant curve to belly */}
          <path 
            d="M 134 150 C 148 156, 152 174, 151 200 L 137 200 C 138 180, 136 164, 131 154 Z" 
            fill={isSleeveless ? skinTone : sleeveColor} 
          />
          {/* Right Arm Inner Seam Shadow */}
          <path 
            d="M 131 154 C 136 166, 138 182, 137 200" 
            stroke="#000000" 
            strokeWidth="1.2" 
            strokeOpacity="0.18" 
            fill="none" 
          />

          {/* If sleeveless dress/top, add delicate shoulder straps */}
          {isSleeveless && (
            <g>
              <path d="M 66 150 C 60 154, 60 162, 62 166 L 68 164 Z" fill={outfitColor} />
              <path d="M 134 150 C 140 154, 140 162, 138 166 L 132 164 Z" fill={outfitColor} />
            </g>
          )}

          {/* Tracksuit accents for women */}
          {isTracksuit && (
            <g>
              <path d="M 54 154 C 50 174, 50 190, 51 200" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              <path d="M 146 154 C 150 174, 150 190, 149 200" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            </g>
          )}
        </g>
      );
    }

    // -------------------------------------------------------------
    // MALE ARMS: Athletic, slightly narrower fit, proportional to belly
    // -------------------------------------------------------------
    return (
      <g id="character-arms-man">
        {/* Full Long Sleeve OR Base Arms */}
        {!isShortSleeve ? (
          <>
            {/* Left Arm (Full sleeve) */}
            <path 
              d="M 60 146 C 46 152, 42 174, 43 200 L 63 200 C 61 176, 62 158, 68 150 Z" 
              fill={sleeveColor} 
            />
            {/* Left Arm Inner Seam Shadow */}
            <path 
              d="M 68 150 C 62 162, 60 180, 63 200" 
              stroke="#000000" 
              strokeWidth="1.6" 
              strokeOpacity="0.2" 
              fill="none" 
            />

            {/* Right Arm (Full sleeve) */}
            <path 
              d="M 140 146 C 154 152, 158 174, 157 200 L 137 200 C 139 176, 138 158, 132 150 Z" 
              fill={sleeveColor} 
            />
            {/* Right Arm Inner Seam Shadow */}
            <path 
              d="M 132 150 C 138 162, 140 180, 137 200" 
              stroke="#000000" 
              strokeWidth="1.6" 
              strokeOpacity="0.2" 
              fill="none" 
            />
          </>
        ) : (
          /* Short Sleeve Tee: Sleeve Cap + Bare Forearm to Belly */
          <>
            {/* Left Arm: Forearm in skin tone */}
            <path 
              d="M 44 172 C 43 182, 43 192, 43 200 L 63 200 C 62 190, 62 178, 63 172 Z" 
              fill={skinTone} 
            />
            {/* Left Arm: Tee sleeve cap */}
            <path 
              d="M 60 146 C 48 152, 44 162, 44 172 L 63 172 C 62 162, 65 154, 68 150 Z" 
              fill={outfitColor} 
            />
            {/* Left Seam */}
            <path 
              d="M 68 150 C 62 162, 60 180, 63 200" 
              stroke="#000000" 
              strokeWidth="1.6" 
              strokeOpacity="0.2" 
              fill="none" 
            />

            {/* Right Arm: Forearm in skin tone */}
            <path 
              d="M 156 172 C 157 182, 157 192, 157 200 L 137 200 C 138 190, 138 178, 137 172 Z" 
              fill={skinTone} 
            />
            {/* Right Arm: Tee sleeve cap */}
            <path 
              d="M 140 146 C 152 152, 156 162, 156 172 L 137 172 C 138 162, 135 154, 132 150 Z" 
              fill={outfitColor} 
            />
            {/* Right Seam */}
            <path 
              d="M 132 150 C 138 162, 140 180, 137 200" 
              stroke="#000000" 
              strokeWidth="1.6" 
              strokeOpacity="0.2" 
              fill="none" 
            />
          </>
        )}

        {/* Tracksuit side racing stripes */}
        {isTracksuit && (
          <g>
            <path d="M 48 152 C 44 172, 44 188, 45 200" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
            <path d="M 152 152 C 156 172, 156 188, 155 200" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          </g>
        )}

        {/* Cyberpunk arm neon light strip */}
        {isCyber && (
          <g>
            <path d="M 47 152 C 43 172, 43 188, 44 200" stroke="#06B6D4" strokeWidth="2" fill="none" />
            <path d="M 153 152 C 157 172, 157 188, 156 200" stroke="#EC4899" strokeWidth="2" fill="none" />
          </g>
        )}

        {/* Varsity contrast cuffs */}
        {isVarsity && (
          <g>
            <path d="M 43 192 L 63 192 L 63 200 L 43 200 Z" fill="#1E293B" />
            <path d="M 137 192 L 157 192 L 157 200 L 137 200 Z" fill="#1E293B" />
          </g>
        )}
      </g>
    );
  };
  // Outfit Render: Completely differentiated between Men & Women
  const renderOutfit = () => {
    // -------------------------------------------------------------
    // FEMALE OUTFITS: Slender silhouette (width 64 to 136), feminine cuts
    // -------------------------------------------------------------
    if (!isMan) {
      switch (outfit) {
        case 'dress':
          return (
            <g>
              {/* Elegant A-line dress with sweetheart collar and cinched waist */}
              <path d="M 66 156 C 66 146, 80 143, 100 143 C 120 143, 134 146, 134 156 L 144 200 L 56 200 Z" fill={outfitColor} />
              {/* Sweetheart collar showing delicate neckline */}
              <path d="M 85 144 Q 93 152 100 148 Q 107 152 115 144 Z" fill="#FFFFFF" opacity="0.9" />
              {/* Ribbon waist belt */}
              <rect x="74" y="174" width="52" height="6" rx="2" fill="#BE123C" />
              <circle cx="100" cy="177" r="4" fill="#FDA4AF" />
            </g>
          );
        case 'summer_top':
          return (
            <g>
              {/* Chic scooped summer blouse */}
              <path d="M 68 156 C 68 147, 82 144, 100 144 C 118 144, 132 147, 132 156 L 138 200 L 62 200 Z" fill={outfitColor} />
              {/* Delicate scoop neckline */}
              <path d="M 82 144 Q 100 156 118 144" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.8" />
              {/* Mini gold pendant */}
              <circle cx="100" cy="154" r="2.5" fill="#F59E0B" />
              <line x1="100" y1="147" x2="100" y2="152" stroke="#F59E0B" strokeWidth="1" />
            </g>
          );
        case 'turtleneck':
          return (
            <g>
              {/* Form-fitting ribbed turtleneck */}
              <rect x="88" y="136" width="24" height="12" rx="3" fill="#1E293B" />
              <path d="M 68 158 C 68 146, 82 143, 100 143 C 118 143, 132 146, 132 158 L 138 200 L 62 200 Z" fill={outfitColor} />
              <line x1="88" y1="138" x2="112" y2="138" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" />
              <line x1="88" y1="142" x2="112" y2="142" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" />
            </g>
          );
        case 'hoodie_cropped':
        case 'hoodie':
          return (
            <g>
              {/* Cute cropped pastel hoodie */}
              <path d="M 66 158 C 66 146, 82 143, 100 143 C 118 143, 134 146, 134 158 L 138 186 L 62 186 Z" fill={outfitColor} />
              {/* Exposed stylish inner tee / waist band */}
              <rect x="68" y="186" width="64" height="14" fill="#F8FAFC" />
              {/* Soft hood collar & drawstrings */}
              <path d="M 84 145 Q 100 154 116 145" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.7" />
              <line x1="93" y1="150" x2="93" y2="164" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="107" y1="150" x2="107" y2="164" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          );
        case 'kimono':
          return (
            <g>
              {/* Traditional Sakura blossom kimono wrap */}
              <path d="M 64 156 C 64 146, 80 142, 100 142 C 120 142, 136 146, 136 156 L 144 200 L 56 200 Z" fill="#FCE7F3" />
              {/* Kimono crossover collars */}
              <path d="M 76 144 L 100 172 L 124 144" stroke={outfitColor} strokeWidth="4" fill="none" />
              {/* Obi sash */}
              <rect x="70" y="172" width="60" height="12" rx="2" fill="#E11D48" />
              <rect x="74" y="175" width="52" height="6" fill="#F59E0B" />
            </g>
          );
        case 'leather_biker':
          return (
            <g>
              {/* Chic fitted leather biker jacket */}
              <path d="M 66 156 C 66 146, 80 143, 100 143 C 120 143, 134 146, 134 156 L 138 200 L 62 200 Z" fill="#1E293B" />
              {/* Lapels */}
              <path d="M 82 144 L 95 168 L 86 172 Z" fill="#334155" />
              <path d="M 118 144 L 105 168 L 114 172 Z" fill="#334155" />
              {/* Silver zipper */}
              <line x1="104" y1="154" x2="108" y2="200" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 1" />
            </g>
          );
        case 'knit_sweater':
          return (
            <g>
              {/* Cozy oversized off-shoulder knit sweater */}
              <path d="M 64 156 C 64 146, 80 144, 100 144 C 120 144, 136 146, 136 156 L 140 200 L 60 200 Z" fill={outfitColor} />
              {/* Soft boatneck collar */}
              <path d="M 78 144 Q 100 152 122 144" stroke="#FDE68A" strokeWidth="3" fill="none" />
              <line x1="68" y1="168" x2="132" y2="168" stroke="#FDE68A" strokeWidth="2" strokeDasharray="4 3" />
            </g>
          );
        case 'varsity':
          return (
            <g>
              {/* Cropped college bomber jacket */}
              <path d="M 66 156 C 66 146, 80 144, 100 144 C 120 144, 134 146, 134 156 L 138 190 L 62 190 Z" fill={outfitColor} />
              <path d="M 62 162 L 76 190 L 62 190 Z" fill="#FFFFFF" />
              <path d="M 138 162 L 124 190 L 138 190 Z" fill="#FFFFFF" />
              <circle cx="100" cy="162" r="2" fill="#FFFFFF" />
              <circle cx="100" cy="174" r="2" fill="#FFFFFF" />
              <text x="84" y="168" fill="#F59E0B" fontSize="9" fontWeight="bold">L</text>
            </g>
          );
        case 'blazer':
          return (
            <g>
              {/* Tailored lady's blazer */}
              <path d="M 66 156 C 66 146, 80 143, 100 143 C 120 143, 134 146, 134 156 L 138 200 L 62 200 Z" fill={outfitColor} />
              <path d="M 88 144 L 100 166 L 112 144 Z" fill="#FFFFFF" />
              <path d="M 80 144 L 94 172 L 84 178 Z" fill="#000000" opacity="0.2" />
              <path d="M 120 144 L 106 172 L 116 178 Z" fill="#000000" opacity="0.2" />
            </g>
          );
        case 'tracksuit':
          return (
            <g>
              {/* Modern cropped athletic tracksuit */}
              <path d="M 66 156 C 66 146, 80 144, 100 144 C 120 144, 134 146, 134 156 L 138 190 L 62 190 Z" fill={outfitColor} />
              <line x1="68" y1="156" x2="64" y2="190" stroke="#FFFFFF" strokeWidth="2.5" />
              <line x1="132" y1="156" x2="136" y2="190" stroke="#FFFFFF" strokeWidth="2.5" />
              <line x1="100" y1="145" x2="100" y2="190" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          );
        case 'cyber_jacket':
          return (
            <g>
              {/* Sleek form-fitting cyberpunk jacket with magenta neon glow */}
              <path d="M 66 156 C 66 146, 80 143, 100 143 C 120 143, 134 146, 134 156 L 138 200 L 62 200 Z" fill="#0F172A" />
              <path d="M 76 144 L 95 170 L 85 195" stroke="#EC4899" strokeWidth="2.8" fill="none" />
              <path d="M 124 144 L 105 170 L 115 195" stroke="#06B6D4" strokeWidth="2.8" fill="none" />
            </g>
          );
        case 'casual_tee':
        default:
          return (
            <g>
              {/* Feminine scoop-neck tee with delicate necklace */}
              <path d="M 66 156 C 66 146, 80 144, 100 144 C 120 144, 134 146, 134 156 L 138 200 L 62 200 Z" fill={outfitColor} />
              <path d="M 82 144 Q 100 156 118 144" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.8" />
              {/* Delicate gold chain */}
              <path d="M 88 145 Q 100 158 112 145" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
              <circle cx="100" cy="158" r="2" fill="#F59E0B" />
            </g>
          );
      }
    }

    // -------------------------------------------------------------
    // MALE OUTFITS: Slim, fit, modern athletic build (width 60 to 140, tapering to 66-134)
    // -------------------------------------------------------------
    switch (outfit) {
      case 'leather_biker':
        return (
          <g>
            <path d="M 60 156 C 60 144, 78 141, 100 141 C 122 141, 140 144, 140 156 L 134 200 L 66 200 Z" fill="#1E293B" />
            <path d="M 80 142 L 94 166 L 82 172 Z" fill="#334155" />
            <path d="M 120 142 L 106 166 L 118 172 Z" fill="#334155" />
            <line x1="102" y1="148" x2="108" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 2" />
          </g>
        );
      case 'hoodie':
        return (
          <g>
            <path d="M 60 156 C 60 144, 78 141, 100 141 C 122 141, 140 144, 140 156 L 134 200 L 66 200 Z" fill={outfitColor} />
            <path d="M 82 142 Q 100 154 118 142" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.6" />
            <line x1="93" y1="148" x2="93" y2="166" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="107" y1="148" x2="107" y2="166" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M 78 180 Q 100 177 122 180 L 120 198 L 80 198 Z" fill="#000000" opacity="0.15" />
          </g>
        );
      case 'varsity':
        return (
          <g>
            <path d="M 58 156 L 68 156 L 66 200 L 58 200 Z" fill="#F8FAFC" />
            <path d="M 142 156 L 132 156 L 134 200 L 142 200 Z" fill="#F8FAFC" />
            <path d="M 68 142 L 132 142 L 132 200 L 68 200 Z" fill={outfitColor} />
            <path d="M 78 142 Q 100 152 122 142" stroke="#F8FAFC" strokeWidth="3.5" fill="none" />
            <circle cx="100" cy="160" r="2.2" fill="#F8FAFC" />
            <circle cx="100" cy="174" r="2.2" fill="#F8FAFC" />
            <circle cx="100" cy="188" r="2.2" fill="#F8FAFC" />
            <text x="83" y="168" fill="#F59E0B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">E</text>
          </g>
        );
      case 'blazer':
        return (
          <g>
            <path d="M 60 156 C 60 144, 78 141, 100 141 C 122 141, 140 144, 140 156 L 134 200 L 66 200 Z" fill={outfitColor} />
            <path d="M 88 142 L 100 166 L 112 142 Z" fill="#FFFFFF" />
            <path d="M 98 150 L 102 150 L 104 186 L 100 191 L 96 186 Z" fill="#DC2626" />
            <path d="M 76 142 L 94 174 L 80 180 Z" fill="#000000" opacity="0.2" />
            <path d="M 124 142 L 106 174 L 120 180 Z" fill="#000000" opacity="0.2" />
          </g>
        );
      case 'explorer':
        return (
          <g>
            <path d="M 60 156 C 60 144, 78 141, 100 141 C 122 141, 140 144, 140 156 L 134 200 L 66 200 Z" fill="#D97706" />
            <rect x="72" y="165" width="18" height="18" rx="2" fill="#B45309" />
            <rect x="110" y="165" width="18" height="18" rx="2" fill="#B45309" />
            <line x1="100" y1="142" x2="100" y2="200" stroke="#78350F" strokeWidth="2" />
          </g>
        );
      case 'cyber_jacket':
        return (
          <g>
            <path d="M 60 156 C 60 144, 78 141, 100 141 C 122 141, 140 144, 140 156 L 134 200 L 66 200 Z" fill="#0F172A" />
            <path d="M 76 142 L 94 170 L 82 200" stroke="#06B6D4" strokeWidth="2.8" fill="none" />
            <path d="M 124 142 L 106 170 L 118 200" stroke="#A855F7" strokeWidth="2.8" fill="none" />
          </g>
        );
      case 'knit_sweater':
        return (
          <g>
            <path d="M 60 156 C 60 144, 78 141, 100 141 C 122 141, 140 144, 140 156 L 134 200 L 66 200 Z" fill={outfitColor} />
            <path d="M 80 144 Q 100 152 120 144" stroke="#FDE68A" strokeWidth="3" fill="none" />
            <line x1="68" y1="172" x2="132" y2="172" stroke="#FDE68A" strokeWidth="2" strokeDasharray="5 3" />
          </g>
        );
      case 'tracksuit':
        return (
          <g>
            <path d="M 60 156 C 60 144, 78 141, 100 141 C 122 141, 140 144, 140 156 L 134 200 L 66 200 Z" fill={outfitColor} />
            <line x1="62" y1="156" x2="68" y2="200" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="138" y1="156" x2="132" y2="200" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="100" y1="142" x2="100" y2="200" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        );
      case 'casual_tee':
      default:
        return (
          <g>
            <path d="M 60 156 C 60 144, 78 141, 100 141 C 122 141, 140 144, 140 156 L 134 200 L 66 200 Z" fill={outfitColor} />
            <path d="M 82 142 Q 100 152 118 142" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.6" />
          </g>
        );
    }
  };

  // Glasses
  const renderGlasses = () => {
    switch (glasses) {
      case 'cat_eye':
        return (
          <g stroke="#BE123C" strokeWidth="2.5" fill="#FDA4AF" fillOpacity="0.25">
            {/* Winged cat eye frames */}
            <path d="M 68 88 L 96 90 L 92 106 Q 80 108 70 102 Z" />
            <path d="M 68 88 L 62 82" strokeWidth="3" />
            <path d="M 104 90 L 132 88 L 130 102 Q 120 108 108 106 Z" />
            <path d="M 132 88 L 138 82" strokeWidth="3" />
            <line x1="96" y1="90" x2="104" y2="90" stroke="#BE123C" strokeWidth="2" />
          </g>
        );
      case 'star_shades':
        return (
          <g fill="#F59E0B" stroke="#D97706" strokeWidth="1.5">
            <polygon points="85,82 89,92 99,92 91,98 94,108 85,102 76,108 79,98 71,92 81,92" />
            <polygon points="115,82 119,92 129,92 121,98 124,108 115,102 106,108 109,98 101,92 111,92" />
            <line x1="99" y1="94" x2="101" y2="94" stroke="#D97706" strokeWidth="2.5" />
          </g>
        );
      case 'specs':
        return (
          <g stroke="#0F172A" strokeWidth="3.2" fill="none">
            <rect x="70" y="86" width="26" height="20" rx="6" fill="#38BDF8" fillOpacity="0.15" />
            <rect x="104" y="86" width="26" height="20" rx="6" fill="#38BDF8" fillOpacity="0.15" />
            <path d="M 96 95 L 104 95" />
            <path d="M 70 94 L 62 90" />
            <path d="M 130 94 L 138 90" />
          </g>
        );
      case 'sunglasses':
        return (
          <g fill="#0F172A">
            <path d="M 68 85 L 98 85 L 95 106 C 95 110, 72 110, 70 106 Z" />
            <path d="M 102 85 L 132 85 L 130 106 C 130 110, 105 110, 102 106 Z" />
            <path d="M 96 89 L 104 89" stroke="#0F172A" strokeWidth="3" />
            <path d="M 72 88 L 78 88 L 74 104 L 70 104 Z" fill="#FFFFFF" opacity="0.4" />
            <path d="M 106 88 L 112 88 L 108 104 L 104 104 Z" fill="#FFFFFF" opacity="0.4" />
          </g>
        );
      case 'retro_round':
        return (
          <g stroke="#D97706" strokeWidth="3" fill="#F59E0B" fillOpacity="0.2">
            <circle cx="83" cy="96" r="14" />
            <circle cx="117" cy="96" r="14" />
            <path d="M 97 96 L 103 96" />
          </g>
        );
      case 'heart_shades':
        return (
          <g fill="#F43F5E" opacity="0.9">
            <path d="M 83 90 C 78 84, 68 87, 72 96 C 75 102, 83 108, 83 108 C 83 108, 91 102, 94 96 C 98 87, 88 84, 83 90 Z" />
            <path d="M 117 90 C 112 84, 102 87, 106 96 C 109 102, 117 108, 117 108 C 117 108, 125 102, 128 96 C 132 87, 122 84, 117 90 Z" />
            <line x1="94" y1="94" x2="106" y2="94" stroke="#F43F5E" strokeWidth="3" />
          </g>
        );
      case 'aviator':
        return (
          <g stroke="#F59E0B" strokeWidth="2.5" fill="#1E293B" fillOpacity="0.7">
            <path d="M 68 88 L 98 88 L 94 108 Q 83 114 70 106 Z" />
            <path d="M 102 88 L 132 88 L 130 106 Q 117 114 106 108 Z" />
            <line x1="98" y1="90" x2="102" y2="90" />
            <line x1="95" y1="86" x2="105" y2="86" />
          </g>
        );
      default:
        return null;
    }
  };

  // Hats
  const renderHat = () => {
    switch (hat) {
      case 'flower_crown':
        return (
          <g>
            <path d="M 66 64 Q 100 50 134 64" stroke="#15803D" strokeWidth="3" fill="none" />
            {/* Flowers */}
            <circle cx="72" cy="62" r="5.5" fill="#FDA4AF" />
            <circle cx="72" cy="62" r="2.5" fill="#FEF08A" />
            <circle cx="88" cy="56" r="6" fill="#F43F5E" />
            <circle cx="88" cy="56" r="2.5" fill="#FEF08A" />
            <circle cx="102" cy="54" r="6.5" fill="#A855F7" />
            <circle cx="102" cy="54" r="2.5" fill="#FEF08A" />
            <circle cx="116" cy="56" r="6" fill="#F43F5E" />
            <circle cx="116" cy="56" r="2.5" fill="#FEF08A" />
            <circle cx="128" cy="62" r="5.5" fill="#FDA4AF" />
            <circle cx="128" cy="62" r="2.5" fill="#FEF08A" />
          </g>
        );
      case 'tiara':
        return (
          <g>
            {/* Royal Princess Tiara */}
            <path d="M 74 60 L 82 46 L 92 54 L 100 38 L 108 54 L 118 46 L 126 60 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="100" cy="42" r="3.5" fill="#38BDF8" />
            <circle cx="82" cy="50" r="2.5" fill="#EC4899" />
            <circle cx="118" cy="50" r="2.5" fill="#EC4899" />
          </g>
        );
      case 'cat_ears':
        return (
          <g>
            {/* Neko headband */}
            <path d="M 66 66 Q 100 48 134 66" stroke="#0F172A" strokeWidth="3" fill="none" />
            {/* Left ear */}
            <polygon points="70,62 60,36 82,48" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
            <polygon points="68,58 64,42 78,49" fill="#FDA4AF" />
            {/* Right ear */}
            <polygon points="130,62 140,36 118,48" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
            <polygon points="132,58 136,42 122,49" fill="#FDA4AF" />
          </g>
        );
      case 'ribbon_bow':
        return (
          <g transform="translate(112, 44)">
            {/* Silk hair bow */}
            <circle cx="8" cy="8" r="3" fill="#991B1B" />
            <path d="M 8 8 Q 1 1 0 8 Q 1 15 8 8 Z" fill="#E11D48" />
            <path d="M 8 8 Q 15 1 16 8 Q 15 15 8 8 Z" fill="#E11D48" />
            <path d="M 7 9 L 3 18" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 9 9 L 13 18" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'snapback':
        return (
          <g>
            <ellipse cx="100" cy="56" rx="34" ry="17" fill="#6366F1" />
            <circle cx="100" cy="40" r="3.5" fill="#F59E0B" />
            <path d="M 70 60 Q 100 48 130 60 Q 100 56 70 60 Z" fill="#4338CA" />
          </g>
        );
      case 'beanie':
        return (
          <g>
            <ellipse cx="100" cy="50" rx="35" ry="24" fill="#E11D48" />
            <rect x="64" y="56" width="72" height="12" rx="4" fill="#BE123C" />
            <circle cx="100" cy="28" r="7" fill="#F8FAFC" />
          </g>
        );
      case 'bucket_hat':
        return (
          <g>
            <path d="M 72 58 L 78 40 L 122 40 L 128 58 Z" fill="#0D9488" />
            <ellipse cx="100" cy="58" rx="44" ry="12" fill="#14B8A6" />
          </g>
        );
      case 'crown':
        return (
          <g>
            <path d="M 68 56 L 70 28 L 84 42 L 100 22 L 116 42 L 130 28 L 132 56 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <circle cx="70" cy="28" r="3.5" fill="#E11D48" />
            <circle cx="100" cy="22" r="4.5" fill="#3B82F6" />
            <circle cx="130" cy="28" r="3.5" fill="#10B981" />
          </g>
        );
      case 'wizard':
        return (
          <g>
            <polygon points="100,8 126,56 74,56" fill="#3730A3" stroke="#4338CA" strokeWidth="1.5" />
            <ellipse cx="100" cy="56" rx="38" ry="8" fill="#312E81" />
            <circle cx="100" cy="28" r="3.5" fill="#FDE047" />
          </g>
        );
      case 'beret':
        return (
          <g>
            <ellipse cx="105" cy="52" rx="34" ry="14" fill="#1E293B" transform="rotate(-8 105 52)" />
            <circle cx="105" cy="40" r="2.5" fill="#E11D48" />
          </g>
        );
      case 'headband':
        return (
          <rect x="68" y="70" width="64" height="10" rx="3" fill="#EF4444" />
        );      case 'baseball_cap':
        return (
          <g>
            {/* Domed Cap Crown */}
            <ellipse cx="100" cy="54" rx="34" ry="18" fill="#1E293B" />
            {/* Top button */}
            <circle cx="100" cy="38" r="3" fill="#E2E8F0" />
            {/* Curved front visor extending dynamically */}
            <path d="M 66 58 Q 100 50 134 58 Q 146 64 142 70 Q 100 60 62 70 Q 56 64 66 58 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
            {/* Athletic eyelets */}
            <circle cx="86" cy="46" r="1.5" fill="#64748B" />
            <circle cx="114" cy="46" r="1.5" fill="#64748B" />
          </g>
        );
      case 'flat_cap':
        return (
          <g>
            {/* Flat cap body tilted over forehead */}
            <path d="M 64 62 C 60 42, 85 36, 100 36 C 115 36, 140 42, 136 62 Q 100 66 64 62 Z" fill="#475569" stroke="#334155" strokeWidth="1.5" />
            {/* Stitched small peak */}
            <path d="M 72 62 Q 100 68 128 62 Q 100 64 72 62 Z" fill="#1E293B" />
            <circle cx="100" cy="37" r="2.5" fill="#334155" />
          </g>
        );
      case 'fedora':
        return (
          <g>
            {/* Wide curled brim */}
            <ellipse cx="100" cy="60" rx="42" ry="12" fill="#334155" />
            {/* Crown with pinch */}
            <path d="M 74 58 C 76 42, 88 44, 100 40 C 112 44, 124 42, 126 58 Z" fill="#1E293B" />
            {/* Crimson satin ribbon */}
            <path d="M 74 58 Q 100 54 126 58 L 126 54 Q 100 50 74 54 Z" fill="#DC2626" />
            {/* Yellow accent feather */}
            <path d="M 124 54 Q 132 40 130 34 Q 124 40 123 52" fill="#FEF08A" />
          </g>
        );
      case 'cowboy':
        return (
          <g>
            {/* High pinched crown */}
            <path d="M 76 56 C 78 34, 88 38, 100 32 C 112 38, 122 34, 124 56 Z" fill="#78350F" />
            {/* Wide curled upturned western brim */}
            <path d="M 50 64 C 54 50, 72 58, 100 58 C 128 58, 146 50, 150 64 Q 100 70 50 64 Z" fill="#92400E" stroke="#78350F" strokeWidth="1" />
            {/* Stitched leather hatband with star buckle */}
            <path d="M 76 56 Q 100 52 124 56" stroke="#451A03" strokeWidth="2.5" fill="none" />
            <polygon points="100,50 102,54 106,54 103,57 104,61 100,58 96,61 97,57 94,54 98,54" fill="#E2E8F0" />
          </g>
        );
      case 'bandana':
        return (
          <g>
            {/* Wrap around forehead */}
            <path d="M 68 56 Q 100 48 132 56 L 132 68 Q 100 60 68 68 Z" fill="#DC2626" />
            {/* Paisley pattern dots */}
            <circle cx="80" cy="62" r="1.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="100" cy="58" r="1.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="120" cy="62" r="1.5" fill="#FFFFFF" opacity="0.8" />
            {/* Knot ties on side */}
            <path d="M 68 64 Q 56 70 54 80 Q 60 76 68 68 Z" fill="#B91C1C" />
          </g>
        );
      case 'top_hat':
        return (
          <g>
            {/* Brim */}
            <ellipse cx="100" cy="58" rx="38" ry="10" fill="#0F172A" />
            {/* Tall cylinder crown */}
            <path d="M 75 56 L 73 20 L 127 20 L 125 56 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
            {/* Silk ribbon */}
            <rect x="74.5" y="48" width="51" height="8" fill="#F59E0B" />
          </g>
        );
      case 'ninja_headband':
        return (
          <g>
            {/* Dark fabric wrap */}
            <path d="M 66 60 Q 100 52 134 60 L 134 72 Q 100 64 66 72 Z" fill="#0F172A" />
            {/* Metallic armor plate */}
            <rect x="85" y="58" width="30" height="12" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="88" cy="64" r="1" fill="#475569" />
            <circle cx="112" cy="64" r="1" fill="#475569" />
            {/* Engraved insignia */}
            <path d="M 96 64 Q 100 60 104 64" stroke="#475569" strokeWidth="1.5" fill="none" />
            {/* Trailing fabric ribbons */}
            <path d="M 66 68 Q 50 78 48 95 Q 56 86 66 72 Z" fill="#1E293B" />
            <path d="M 66 68 Q 54 74 52 88 Q 60 80 66 72 Z" fill="#334155" />
          </g>
        );

      default:
        return null;
    }
  };

  // Accessories
  const renderAccessory = () => {
    switch (accessory) {
      case 'choker':
        return (
          <g>
            <rect x="91" y="137" width="18" height="4" rx="1.5" fill="#0F172A" />
            <circle cx="100" cy="141" r="2.5" fill="#E11D48" />
          </g>
        );
      case 'silver_pendant':
        return (
          <g>
            <path d="M 88 144 Q 100 162 112 144" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
            <polygon points="100,158 102,163 107,163 103,166 105,171 100,168 95,171 97,166 93,163 98,163" fill="#CBD5E1" />
          </g>
        );
      case 'bowtie':
        return (
          <g transform="translate(100, 145)">
            <circle cx="0" cy="0" r="3" fill="#991B1B" />
            <polygon points="0,0 -12,-6 -12,6" fill="#E11D48" />
            <polygon points="0,0 12,-6 12,6" fill="#E11D48" />
          </g>
        );
      case 'medal':
        return (
          <g>
            <path d="M 94 144 L 100 160 L 106 144" stroke="#EF4444" strokeWidth="3" fill="none" />
            <circle cx="100" cy="164" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <text x="98.5" y="166.5" fill="#78350F" fontSize="6" fontWeight="bold">1</text>
          </g>
        );
      case 'headphones':
        return (
          <g>
            <path d="M 58 90 C 58 40, 142 40, 142 90" stroke="#0F172A" strokeWidth="7" fill="none" />
            <rect x="52" y="84" width="13" height="24" rx="6" fill="#06B6D4" stroke="#0891B2" strokeWidth="2" />
            <rect x="135" y="84" width="13" height="24" rx="6" fill="#06B6D4" stroke="#0891B2" strokeWidth="2" />
          </g>
        );
      case 'gold_chain':
        return (
          <g>
            <path d="M 80 152 Q 100 175 120 152" stroke="#F59E0B" strokeWidth="4" strokeDasharray="3 2" fill="none" />
            <circle cx="100" cy="167" r="4" fill="#D97706" />
          </g>
        );
      case 'pearl_necklace':
        return (
          <g>
            <path d="M 82 147 Q 100 162 118 147" stroke="#F8FAFC" strokeWidth="3.5" strokeDasharray="2 3" fill="none" />
          </g>
        );
      case 'scarf':
        return (
          <g>
            <ellipse cx="100" cy="144" rx="26" ry="9" fill="#EA580C" />
            <rect x="108" y="145" width="12" height="32" rx="3" fill="#EA580C" />
          </g>
        );
      case 'backpack':
        return (
          <g>
            <path d="M 66 148 L 60 190" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <path d="M 134 148 L 140 190" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  // Pet Companion
  const renderPet = () => {
    switch (pet) {
      case 'bunny':
        return (
          <g transform="translate(144, 142) scale(0.6)">
            {/* Snowy bunny body */}
            <ellipse cx="25" cy="30" rx="16" ry="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Long ears with pink inner */}
            <ellipse cx="18" cy="12" rx="4" ry="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <ellipse cx="18" cy="12" rx="2" ry="8" fill="#FDA4AF" />
            <ellipse cx="28" cy="12" rx="4" ry="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <ellipse cx="28" cy="12" rx="2" ry="8" fill="#FDA4AF" />
            {/* Eyes & nose */}
            <circle cx="20" cy="27" r="2" fill="#E11D48" />
            <circle cx="28" cy="27" r="2" fill="#E11D48" />
            <circle cx="24" cy="31" r="1.5" fill="#FB7185" />
          </g>
        );
      case 'phoenix':
        return (
          <g transform="translate(142, 134) scale(0.62)">
            {/* Fiery baby phoenix */}
            <ellipse cx="25" cy="26" rx="15" ry="18" fill="#EF4444" />
            <path d="M 8 26 Q 16 12 25 10 Q 34 12 42 26" stroke="#F59E0B" strokeWidth="4" fill="none" />
            <circle cx="19" cy="23" r="2.5" fill="#FEF08A" />
            <circle cx="31" cy="23" r="2.5" fill="#FEF08A" />
            <polygon points="22,27 28,27 25,33" fill="#F59E0B" />
          </g>
        );
      case 'panda':
        return (
          <g transform="translate(144, 140) scale(0.62)">
            {/* Panda ears */}
            <circle cx="14" cy="14" r="5" fill="#0F172A" />
            <circle cx="36" cy="14" r="5" fill="#0F172A" />
            {/* Face */}
            <circle cx="25" cy="26" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            {/* Eye patches */}
            <ellipse cx="19" cy="24" rx="4" ry="5" fill="#0F172A" transform="rotate(-15 19 24)" />
            <circle cx="19" cy="23" r="1.5" fill="#FFFFFF" />
            <ellipse cx="31" cy="24" rx="4" ry="5" fill="#0F172A" transform="rotate(15 31 24)" />
            <circle cx="31" cy="23" r="1.5" fill="#FFFFFF" />
            {/* Nose */}
            <ellipse cx="25" cy="29" rx="2" ry="1.5" fill="#0F172A" />
          </g>
        );
      case 'owl':
        return (
          <g transform="translate(142, 130) scale(0.65)">
            <ellipse cx="25" cy="30" rx="20" ry="24" fill="#78350F" />
            <ellipse cx="25" cy="34" rx="14" ry="18" fill="#FDE68A" />
            <circle cx="17" cy="22" r="7" fill="#FFFFFF" />
            <circle cx="33" cy="22" r="7" fill="#FFFFFF" />
            <circle cx="18" cy="22" r="3.5" fill="#0F172A" />
            <circle cx="32" cy="22" r="3.5" fill="#0F172A" />
            <polygon points="22,27 28,27 25,33" fill="#F59E0B" />
          </g>
        );
      case 'robot_pup':
        return (
          <g transform="translate(142, 140) scale(0.65)">
            <rect x="8" y="15" width="34" height="28" rx="8" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <rect x="14" y="22" width="22" height="7" rx="3" fill="#38BDF8" />
            <line x1="25" y1="15" x2="25" y2="6" stroke="#475569" strokeWidth="2.5" />
            <circle cx="25" cy="5" r="3.5" fill="#EF4444" />
            <rect x="4" y="18" width="6" height="12" rx="2" fill="#64748B" />
            <rect x="40" y="18" width="6" height="12" rx="2" fill="#64748B" />
          </g>
        );
      case 'slime':
        return (
          <g transform="translate(146, 150) scale(0.6)">
            <path d="M 10 35 C 10 15, 40 15, 40 35 C 44 42, 6 42, 10 35 Z" fill="#22C55E" />
            <circle cx="20" cy="28" r="3" fill="#0F172A" />
            <circle cx="30" cy="28" r="3" fill="#0F172A" />
            <path d="M 22 34 Q 25 37 28 34" stroke="#0F172A" strokeWidth="2" fill="none" />
          </g>
        );
      case 'cat':
        return (
          <g transform="translate(146, 142) scale(0.62)">
            <circle cx="25" cy="26" r="16" fill="#F97316" />
            <polygon points="12,18 16,8 24,14" fill="#EA580C" />
            <polygon points="38,18 34,8 26,14" fill="#EA580C" />
            <circle cx="19" cy="25" r="2.5" fill="#1E293B" />
            <circle cx="31" cy="25" r="2.5" fill="#1E293B" />
            <circle cx="25" cy="29" r="1.5" fill="#FDA4AF" />
          </g>
        );
      case 'dragon':
        return (
          <g transform="translate(144, 136) scale(0.6)">
            <circle cx="25" cy="25" r="16" fill="#8B5CF6" />
            <polygon points="10,16 14,6 22,12" fill="#6D28D9" />
            <polygon points="40,16 36,6 28,12" fill="#6D28D9" />
            <circle cx="19" cy="24" r="3" fill="#FDE047" />
            <circle cx="31" cy="24" r="3" fill="#FDE047" />
            <circle cx="25" cy="33" r="3.5" fill="#F59E0B" />
          </g>
        );
      default:
        return null;
    }
  };

  // Background Aura / Glow
  const renderBackground = () => {
    switch (background) {
      case 'starlight':
        return (
          <g>
            <circle cx="100" cy="100" r="92" fill="#1E1B4B" opacity="0.75" />
            <circle cx="50" cy="45" r="1.5" fill="#FFFFFF" />
            <circle cx="150" cy="50" r="2" fill="#FDE047" />
            <circle cx="45" cy="115" r="2" fill="#38BDF8" />
            <circle cx="155" cy="110" r="1.5" fill="#FDA4AF" />
            <circle cx="100" cy="25" r="2.5" fill="#FFFFFF" />
            <polygon points="100,18 102,23 107,23 103,26 105,31 100,28 95,31 97,26 93,23 98,23" fill="#FEF08A" opacity="0.6" />
          </g>
        );
      case 'bubblegum':
        return (
          <g>
            <circle cx="100" cy="100" r="92" fill="url(#bubblegum-grad)" opacity="0.75" />
            <circle cx="45" cy="50" r="8" fill="#F43F5E" opacity="0.2" />
            <circle cx="155" cy="45" r="10" fill="#EC4899" opacity="0.2" />
            <circle cx="40" cy="120" r="6" fill="#38BDF8" opacity="0.2" />
          </g>
        );
      case 'matrix':
        return (
          <g>
            <circle cx="100" cy="100" r="92" fill="#022C22" opacity="0.8" />
            <line x1="40" y1="30" x2="40" y2="170" stroke="#22C55E" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            <line x1="80" y1="20" x2="80" y2="180" stroke="#22C55E" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
            <line x1="120" y1="20" x2="120" y2="180" stroke="#22C55E" strokeWidth="1" strokeDasharray="3 5" opacity="0.4" />
            <line x1="160" y1="30" x2="160" y2="170" stroke="#22C55E" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
          </g>
        );
      case 'cosmic':
        return (
          <g>
            <circle cx="100" cy="100" r="92" fill="url(#cosmic-grad)" opacity="0.6" />
            <circle cx="45" cy="40" r="2" fill="#FFFFFF" />
            <circle cx="155" cy="45" r="2.5" fill="#FDE047" />
            <circle cx="160" cy="115" r="1.5" fill="#FFFFFF" />
            <circle cx="40" cy="120" r="2" fill="#A855F7" />
          </g>
        );
      case 'sunset':
        return (
          <g>
            <circle cx="100" cy="100" r="92" fill="url(#sunset-grad)" opacity="0.65" />
          </g>
        );
      case 'cyber':
        return (
          <g>
            <circle cx="100" cy="100" r="92" fill="url(#cyber-grad)" opacity="0.7" />
            <line x1="20" y1="130" x2="180" y2="130" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <line x1="20" y1="150" x2="180" y2="150" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          </g>
        );
      case 'sakura':
        return (
          <g>
            <circle cx="100" cy="100" r="92" fill="#FCE7F3" opacity="0.4" />
            <circle cx="40" cy="45" r="4" fill="#F43F5E" opacity="0.6" />
            <circle cx="160" cy="50" r="5" fill="#FB7185" opacity="0.5" />
            <circle cx="35" cy="115" r="3.5" fill="#F43F5E" opacity="0.5" />
          </g>
        );
      case 'aurora':
        return (
          <g>
            <circle cx="100" cy="100" r="92" fill="#064E3B" opacity="0.5" />
            <path d="M 20 80 Q 100 40 180 80 Q 100 60 20 80 Z" fill="#10B981" opacity="0.4" />
            <path d="M 20 110 Q 100 70 180 110 Q 100 90 20 110 Z" fill="#06B6D4" opacity="0.3" />
          </g>
        );
      default:
        return (
          <circle cx="100" cy="100" r="90" fill="#1E293B" opacity="0.75" />
        );
    }
  };

  return (
    <div 
      className={`inline-flex items-center justify-center relative ${className}`}
      style={{ width: pxSize, height: pxSize }}
    >
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full drop-shadow-xl ${animate ? 'transition-transform duration-300 hover:scale-105' : ''}`}
      >
        <defs>
          <radialGradient id="cosmic-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunset-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cyber-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#4F46E5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bubblegum-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="skin-shade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="70%" stopColor={skinTone} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* 1. Background Aura */}
        {renderBackground()}

        {/* 2. Body Layer / Torso Outline */}
        <g id="character-body">
          {/* Neck: Slender & graceful for woman, sleek & athletic for man */}
          {isMan ? (
            <rect x="91" y="124" width="18" height="22" rx="3" fill="url(#skin-shade)" />
          ) : (
            <rect x="94" y="124" width="12" height="23" rx="3" fill="url(#skin-shade)" />
          )}

          {isMan ? (
            // MAN: Slim, handsome, youthful athletic oval with defined chin
            <path
              d="M 72 84 C 72 58, 128 58, 128 84 C 128 107, 117 133, 100 135 C 83 133, 72 107, 72 84 Z"
              fill={skinTone}
            />
          ) : (
            // WOMAN: Slender, delicate, soft feminine oval silhouette
            <path
              d="M 75 85 C 75 60, 125 60, 125 85 C 125 108, 115 132, 100 133 C 85 132, 75 108, 75 85 Z"
              fill={skinTone}
            />
          )}

          {/* Ears */}
          <ellipse cx={isMan ? "71" : "74"} cy="95" rx={isMan ? "4" : "3.5"} ry={isMan ? "7" : "6.5"} fill={skinTone} />
          <ellipse cx={isMan ? "129" : "126"} cy="95" rx={isMan ? "4" : "3.5"} ry={isMan ? "7" : "6.5"} fill={skinTone} />
          
          {/* WOMAN: Delicate gold pearl stud earrings */}
          {!isMan && (
            <g>
              <circle cx="73.5" cy="98" r="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
              <circle cx="126.5" cy="98" r="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
            </g>
          )}

          {/* Nose: Subtle tiny dot for woman vs clean contour for man */}
          {isMan ? (
            <path d="M 99 107 Q 100 113 103 113" stroke="#4A2E18" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
          ) : (
            <circle cx="100" cy="110" r="1.2" fill="#BE123C" opacity="0.35" />
          )}

          {/* Eyes & Eyebrows */}
          {renderEyebrows()}
          {renderEyes()}

          {/* Mouth */}
          {renderMouth()}
        </g>

        {/* 3. Hair */}
        {renderHair()}

        {/* 4. Outfit */}
        {renderOutfit()}
        {/* Arms Layer */}
        {renderArms()}

        {/* 5. Accessories */}
        {renderAccessory()}

        {/* 6. Glasses */}
        {renderGlasses()}

        {/* 7. Hat */}
        {renderHat()}

        {/* 8. Pet Companion */}
        {renderPet()}
      </svg>
    </div>
  );
};
