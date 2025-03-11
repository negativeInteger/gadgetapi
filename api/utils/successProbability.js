/**
 * Calculates the mission success probability based on the gadget's status.
 *
 * - `AVAILABLE` → 90% success rate
 * - `DEPLOYED` → 70% success rate
 * - `DESTROYED` → 20% success rate
 * - `DECOMMISSIONED` → 10% success rate
 *
 * @param {Object} gadget - The gadget object.
 * @param {string} gadget.status - The current status of the gadget.
 * @returns {number} The probability of mission success (0 to 1).
 */
export const calculateMissionSuccessProbability = (gadget) => {
    switch (gadget.status) {
      case 'AVAILABLE':
        return 0.9;
      case 'DEPLOYED':
        return 0.7;
      case 'DESTROYED':
        return 0.2;
      case 'DECOMMISSIONED':
        return 0.1;
      default:
        return 0;
    }
};