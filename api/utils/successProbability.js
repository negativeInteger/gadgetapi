/**
 * Calculates Mission Success Probability based on gadget status
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