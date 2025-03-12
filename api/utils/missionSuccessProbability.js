/**
 * Generates a random mission success probability based on the gadget's status.
 * @param {"AVAILABLE" | "DEPLOYED" | "DECOMMISSIONED" | "DESTROYED"} status - The status of the gadget.
 * @returns {number} A random probability (percentage) between the predefined min and max values.
 */
export const generateMissionSuccessProbability = (status) => {
  const probabilityRanges = {
      AVAILABLE: [70, 90],       // High success probability
      DEPLOYED: [50, 80],        // Moderate success probability
      DECOMMISSIONED: [10, 30],  // Low success probability
      DESTROYED: [0, 10]         // Almost no chance of success
  };

  const [min, max] = probabilityRanges[status];

  return `${parseInt((Math.random() * (max - min) + min))}%`;
};
