// Find similar outfits based on various criteria

import { Outfit, ClothingItem } from '../types';
import { analyzeColorHarmony } from './colorMatcher';

export interface SimilarOutfit {
  outfit: Outfit;
  similarityScore: number;
  reason: string;
  items: ClothingItem[];
}

/**
 * Calculate Jaccard similarity between two sets
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(item => set2.has(item)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Extract colors from outfit items
 */
function getOutfitColors(itemIds: string[], wardrobeItems: ClothingItem[]): string[] {
  return itemIds
    .map(id => wardrobeItems.find(item => item.id === id))
    .filter(Boolean)
    .map(item => item!.color);
}

/**
 * Extract categories from outfit items
 */
function getOutfitCategories(itemIds: string[], wardrobeItems: ClothingItem[]): Set<string> {
  return new Set(
    itemIds
      .map(id => wardrobeItems.find(item => item.id === id))
      .filter(Boolean)
      .map(item => item!.category)
  );
}

/**
 * Check if two outfits have similar color schemes
 */
function haveSimilarColors(
  items1: string[],
  items2: string[],
  wardrobeItems: ClothingItem[]
): boolean {
  const colors1 = getOutfitColors(items1, wardrobeItems);
  const colors2 = getOutfitColors(items2, wardrobeItems);
  
  const colorSet1 = new Set(colors1.map(c => c.toLowerCase()));
  const colorSet2 = new Set(colors2.map(c => c.toLowerCase()));
  
  const similarity = jaccardSimilarity(colorSet1, colorSet2);
  return similarity >= 0.4; // At least 40% color overlap
}

/**
 * Check if two outfits have the same category structure
 */
function haveSameCategories(
  items1: string[],
  items2: string[],
  wardrobeItems: ClothingItem[]
): boolean {
  const cats1 = getOutfitCategories(items1, wardrobeItems);
  const cats2 = getOutfitCategories(items2, wardrobeItems);
  
  // Check if they have the same categories
  if (cats1.size !== cats2.size) return false;
  
  return [...cats1].every(cat => cats2.has(cat));
}

/**
 * Find outfits similar to a given outfit
 */
export function findSimilarOutfits(
  targetOutfit: Outfit,
  allOutfits: Outfit[],
  wardrobeItems: ClothingItem[],
  limit: number = 5
): SimilarOutfit[] {
  const similarOutfits: SimilarOutfit[] = [];
  
  const targetItemSet = new Set(targetOutfit.items);
  const targetColors = getOutfitColors(targetOutfit.items, wardrobeItems);
  const targetCategories = getOutfitCategories(targetOutfit.items, wardrobeItems);
  
  for (const outfit of allOutfits) {
    // Skip the target outfit itself (compare by ID only for uniqueness)
    if (outfit.id === targetOutfit.id) {
      continue;
    }
    
    // Skip empty outfits
    if (outfit.items.length === 0) continue;
    
    let score = 0;
    let reasons: string[] = [];
    
    // Calculate item overlap
    const outfitItemSet = new Set(outfit.items);
    const itemSimilarity = jaccardSimilarity(targetItemSet, outfitItemSet);
    score += itemSimilarity * 50; // Max 50 points for item similarity
    
    if (itemSimilarity > 0.5) {
      reasons.push('shares many items');
    }
    
    // Check color similarity
    if (haveSimilarColors(targetOutfit.items, outfit.items, wardrobeItems)) {
      score += 25;
      reasons.push('similar colors');
    }
    
    // Check category structure
    if (haveSameCategories(targetOutfit.items, outfit.items, wardrobeItems)) {
      score += 25;
      reasons.push('same outfit structure');
    }
    
    // Only include outfits with some similarity
    if (score > 20) {
      const items = outfit.items
        .map(id => wardrobeItems.find(item => item.id === id))
        .filter(Boolean) as ClothingItem[];
      
      similarOutfits.push({
        outfit,
        similarityScore: score,
        reason: reasons.join(', '),
        items,
      });
    }
  }
  
  // Sort by similarity score (highest first) and limit results
  return similarOutfits
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Find outfits with matching color schemes
 */
export function findOutfitsByColor(
  targetColors: string[],
  allOutfits: Outfit[],
  wardrobeItems: ClothingItem[],
  limit: number = 5
): SimilarOutfit[] {
  const similarOutfits: SimilarOutfit[] = [];
  const targetColorSet = new Set(targetColors.map(c => c.toLowerCase()));
  
  for (const outfit of allOutfits) {
    if (outfit.items.length === 0) continue;
    
    const outfitColors = getOutfitColors(outfit.items, wardrobeItems);
    const outfitColorSet = new Set(outfitColors.map(c => c.toLowerCase()));
    
    const similarity = jaccardSimilarity(targetColorSet, outfitColorSet);
    const score = similarity * 100;
    
    if (score > 30) {
      const items = outfit.items
        .map(id => wardrobeItems.find(item => item.id === id))
        .filter(Boolean) as ClothingItem[];
      
      similarOutfits.push({
        outfit,
        similarityScore: score,
        reason: 'matching color scheme',
        items,
      });
    }
  }
  
  return similarOutfits
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Find outfits with the same category structure
 */
export function findOutfitsByStructure(
  targetCategories: string[],
  allOutfits: Outfit[],
  wardrobeItems: ClothingItem[],
  limit: number = 5
): SimilarOutfit[] {
  const similarOutfits: SimilarOutfit[] = [];
  const targetCategorySet = new Set(targetCategories);
  
  for (const outfit of allOutfits) {
    if (outfit.items.length === 0) continue;
    
    const outfitCategories = getOutfitCategories(outfit.items, wardrobeItems);
    
    // Check if categories match exactly
    if (
      outfitCategories.size === targetCategorySet.size &&
      [...targetCategorySet].every(cat => outfitCategories.has(cat))
    ) {
      const items = outfit.items
        .map(id => wardrobeItems.find(item => item.id === id))
        .filter(Boolean) as ClothingItem[];
      
      similarOutfits.push({
        outfit,
        similarityScore: 100,
        reason: 'same outfit structure',
        items,
      });
    }
  }
  
  return similarOutfits
    .sort((a, b) => new Date(b.outfit.date).getTime() - new Date(a.outfit.date).getTime())
    .slice(0, limit);
}

/**
 * Generate alternative outfit suggestions based on a current outfit
 */
export function generateAlternatives(
  currentItems: string[],
  wardrobeItems: ClothingItem[],
  limit: number = 3
): ClothingItem[][] {
  const alternatives: ClothingItem[][] = [];
  
  // Get current outfit structure
  const currentItemObjects = currentItems
    .map(id => wardrobeItems.find(item => item.id === id))
    .filter(Boolean) as ClothingItem[];
  
  if (currentItemObjects.length === 0) return alternatives;
  
  const currentColors = currentItemObjects.map(i => i.color);
  const currentCategories = new Set(currentItemObjects.map(i => i.category));
  
  // For each category in current outfit, try to find alternatives
  currentCategories.forEach(category => {
    const currentItem = currentItemObjects.find(i => i.category === category);
    if (!currentItem) return;
    
    // Find items in the same category that aren't currently selected
    const categoryItems = wardrobeItems.filter(
      item => item.category === category && !currentItems.includes(item.id)
    );
    
    // Try each alternative and check color harmony
    categoryItems.forEach(altItem => {
      const newOutfit = currentItemObjects.map(item =>
        item.category === category ? altItem : item
      );
      
      const newColors = newOutfit.map(i => i.color);
      const colorAnalysis = analyzeColorHarmony(newColors);
      
      // Only include if colors work well together
      if (colorAnalysis.isHarmonious && colorAnalysis.score >= 70) {
        alternatives.push(newOutfit);
      }
    });
  });
  
  // Sort by color harmony score and limit
  return alternatives
    .sort((a, b) => {
      const scoreA = analyzeColorHarmony(a.map(i => i.color)).score;
      const scoreB = analyzeColorHarmony(b.map(i => i.color)).score;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
