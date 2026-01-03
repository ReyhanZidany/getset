// Color harmony and matching logic for outfit combinations

/**
 * Common neutral colors that match with everything
 */
const NEUTRAL_COLORS = [
  'black', 'white', 'gray', 'grey', 'beige', 'cream', 'tan', 
  'brown', 'navy', 'denim', 'khaki', 'ivory', 'charcoal'
];

/**
 * Color wheel relationships - complementary colors
 */
const COMPLEMENTARY_COLORS: Record<string, string[]> = {
  red: ['green', 'teal', 'turquoise'],
  blue: ['orange', 'coral', 'peach'],
  yellow: ['purple', 'violet', 'lavender'],
  green: ['red', 'pink', 'magenta'],
  orange: ['blue', 'navy', 'cyan'],
  purple: ['yellow', 'gold', 'lime'],
  pink: ['green', 'mint', 'olive'],
};

/**
 * Analogous colors (adjacent on color wheel)
 */
const ANALOGOUS_COLORS: Record<string, string[]> = {
  red: ['orange', 'pink', 'burgundy', 'coral'],
  blue: ['purple', 'teal', 'cyan', 'navy'],
  yellow: ['orange', 'gold', 'lime', 'cream'],
  green: ['teal', 'lime', 'olive', 'mint'],
  orange: ['red', 'coral', 'peach', 'gold'],
  purple: ['pink', 'blue', 'lavender', 'violet'],
  pink: ['red', 'coral', 'rose', 'magenta'],
};

/**
 * Colors that typically clash
 */
const CLASHING_COLORS: Record<string, string[]> = {
  red: ['pink', 'orange', 'purple'],
  green: ['blue', 'red'],
  yellow: ['green', 'orange'],
  purple: ['red', 'green'],
  orange: ['red', 'purple'],
  pink: ['red', 'orange', 'yellow'],
};

/**
 * Extract base color from color name or description
 */
export function extractBaseColor(colorString: string): string {
  const color = colorString.toLowerCase().trim();
  
  // Check for neutral colors first
  for (const neutral of NEUTRAL_COLORS) {
    if (color.includes(neutral)) {
      return neutral;
    }
  }
  
  // Check for main colors
  const mainColors = ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink'];
  for (const mainColor of mainColors) {
    if (color.includes(mainColor)) {
      return mainColor;
    }
  }
  
  // Default to the original color if not recognized
  return color;
}

/**
 * Check if a color is neutral
 */
export function isNeutralColor(color: string): boolean {
  const baseColor = extractBaseColor(color);
  return NEUTRAL_COLORS.includes(baseColor);
}

/**
 * Check if two colors are complementary
 */
export function areComplementary(color1: string, color2: string): boolean {
  const base1 = extractBaseColor(color1);
  const base2 = extractBaseColor(color2);
  
  return COMPLEMENTARY_COLORS[base1]?.includes(base2) || 
         COMPLEMENTARY_COLORS[base2]?.includes(base1) ||
         false;
}

/**
 * Check if two colors are analogous
 */
export function areAnalogous(color1: string, color2: string): boolean {
  const base1 = extractBaseColor(color1);
  const base2 = extractBaseColor(color2);
  
  return ANALOGOUS_COLORS[base1]?.includes(base2) || 
         ANALOGOUS_COLORS[base2]?.includes(base1) ||
         false;
}

/**
 * Check if two colors clash
 */
export function doColorsClash(color1: string, color2: string): boolean {
  const base1 = extractBaseColor(color1);
  const base2 = extractBaseColor(color2);
  
  // Neutrals don't clash with anything
  if (isNeutralColor(color1) || isNeutralColor(color2)) {
    return false;
  }
  
  return CLASHING_COLORS[base1]?.includes(base2) || 
         CLASHING_COLORS[base2]?.includes(base1) ||
         false;
}

/**
 * Check if two colors are the same or very similar (monochromatic)
 */
export function areMonochromatic(color1: string, color2: string): boolean {
  const base1 = extractBaseColor(color1);
  const base2 = extractBaseColor(color2);
  
  return base1 === base2;
}

/**
 * Analyze color harmony for an outfit
 */
export interface ColorAnalysis {
  isHarmonious: boolean;
  message: string;
  suggestion?: string;
  score: number; // 0-100
}

export function analyzeColorHarmony(colors: string[]): ColorAnalysis {
  if (colors.length === 0) {
    return {
      isHarmonious: true,
      message: 'No colors to analyze',
      score: 100,
    };
  }
  
  if (colors.length === 1) {
    return {
      isHarmonious: true,
      message: 'Single color - looks great!',
      score: 100,
    };
  }
  
  let score = 100;
  let clashCount = 0;
  let neutralCount = 0;
  let complementaryCount = 0;
  let analogousCount = 0;
  let monochromaticCount = 0;
  
  // Count neutrals
  colors.forEach(color => {
    if (isNeutralColor(color)) {
      neutralCount++;
    }
  });
  
  // Analyze pairs of colors
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const color1 = colors[i];
      const color2 = colors[j];
      
      if (doColorsClash(color1, color2)) {
        clashCount++;
        score -= 30;
      } else if (areComplementary(color1, color2)) {
        complementaryCount++;
        score += 10;
      } else if (areAnalogous(color1, color2)) {
        analogousCount++;
        score += 5;
      } else if (areMonochromatic(color1, color2)) {
        monochromaticCount++;
        score += 5;
      }
    }
  }
  
  // Calculate final score (0-100)
  score = Math.max(0, Math.min(100, score));
  
  // Generate message based on analysis
  if (clashCount > 0) {
    return {
      isHarmonious: false,
      message: '⚠️ These colors might clash',
      suggestion: 'Try pairing with neutral colors like black, white, or beige',
      score,
    };
  }
  
  if (neutralCount === colors.length) {
    return {
      isHarmonious: true,
      message: '✅ Classic neutral combination!',
      score,
    };
  }
  
  if (complementaryCount > 0) {
    return {
      isHarmonious: true,
      message: '✅ Great complementary color match!',
      score,
    };
  }
  
  if (analogousCount > 0 || monochromaticCount > 0) {
    return {
      isHarmonious: true,
      message: '✅ Harmonious color combination!',
      score,
    };
  }
  
  if (neutralCount > 0) {
    return {
      isHarmonious: true,
      message: '✅ Good mix with neutrals!',
      score,
    };
  }
  
  // Default: colors work together
  return {
    isHarmonious: true,
    message: '✅ Nice color combination!',
    score,
  };
}

/**
 * Suggest colors that would work well with the given colors
 */
export function suggestMatchingColors(colors: string[]): string[] {
  if (colors.length === 0) {
    return NEUTRAL_COLORS.slice(0, 3);
  }
  
  const suggestions = new Set<string>();
  
  colors.forEach(color => {
    const baseColor = extractBaseColor(color);
    
    // Always suggest neutrals
    NEUTRAL_COLORS.slice(0, 3).forEach(n => suggestions.add(n));
    
    // Add complementary colors
    if (COMPLEMENTARY_COLORS[baseColor]) {
      COMPLEMENTARY_COLORS[baseColor].forEach(c => suggestions.add(c));
    }
    
    // Add analogous colors
    if (ANALOGOUS_COLORS[baseColor]) {
      ANALOGOUS_COLORS[baseColor].slice(0, 2).forEach(c => suggestions.add(c));
    }
  });
  
  // Remove colors that are already in the outfit
  colors.forEach(color => {
    const baseColor = extractBaseColor(color);
    suggestions.delete(baseColor);
  });
  
  return Array.from(suggestions).slice(0, 5);
}
