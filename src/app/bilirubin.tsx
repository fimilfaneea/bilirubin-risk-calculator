const bilirubinLevelsWithRisk: Record<number, number[][]> = { 
  38: [
    [6, 8, 10, 12, 14, 16, 18, 18.5], // 0-96 hours
    Array(10).fill(18.5), // 96+ hours
  ],
  37: [
    [5.5, 7.5, 9.5, 11.5, 13.5, 15.5, 17.5, 18], 
    Array(10).fill(18.5),
  ],
  36: [
    [5, 7, 9, 11, 13, 15, 17, 17.8], 
    Array(10).fill(18.5),
  ],
  35: [
    [4.5, 6.5, 8.5, 10.5, 12.5, 14.5, 16.5, 17.3], 
    Array(10).fill(18.5),
  ],
};

// No risk factor values (slightly lower values)
const bilirubinLevelsNoRisk: Record<number, number[][]> = { 
  38: [
    [5, 7, 9, 11, 13, 15, 17, 17.5], // 0-96 hours
    Array(10).fill(17.5), // 96+ hours
  ],
  37: [
    [4.5, 6.5, 8.5, 10.5, 12.5, 14.5, 16.5, 17], 
    Array(10).fill(17.5),
  ],
  36: [
    [4, 6, 8, 10, 12, 14, 16, 16.8], 
    Array(10).fill(17.5),
  ],
  35: [
    [3.5, 5.5, 7.5, 9.5, 11.5, 13.5, 15.5, 16.3], 
    Array(10).fill(17.5),
  ],
};

const getBilirubinLevel = (
  riskFactorCount: number,
  gestationalAge: number,
  postnatalAge: number
): number | null => {
  // Select the appropriate dataset
  const levels = riskFactorCount > 0 ? bilirubinLevelsWithRisk : bilirubinLevelsNoRisk;
  
  if (!levels[gestationalAge]) return null; // Unsupported gestational age

  const ageGroups = levels[gestationalAge];

  // Determine index based on postnatal age
  const index =
    postnatalAge <= 12 ? 0 :
    postnatalAge <= 24 ? 1 :
    postnatalAge <= 36 ? 2 :
    postnatalAge <= 48 ? 3 :
    postnatalAge <= 60 ? 4 :
    postnatalAge <= 72 ? 5 :
    postnatalAge <= 84 ? 6 :
    postnatalAge <= 96 ? 7 : 8;

  return ageGroups[index >= 8 ? 1 : 0][index >= 8 ? index - 8 : index];
};

// Example usage:
console.log(getBilirubinLevel(1, 36, 48));  // Should return 11 (with risk)
console.log(getBilirubinLevel(0, 37, 72));  // Should return 14.5 (no risk)
console.log(getBilirubinLevel(2, 35, 120)); // Should return 18.5 (with risk)
console.log(getBilirubinLevel(0, 38, 120)); // Should return 17.5 (no risk)
console.log(getBilirubinLevel(0, 34, 48));  // Should return null (unsupported age)
