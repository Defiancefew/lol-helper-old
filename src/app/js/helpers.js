import { reduce } from 'lodash';

export const calculatePointsLeft = (branchState) =>
  (30 - (reduce(branchState, (prev, next) => prev + next) + 1));

export const rankPointsSum = (pointsReq, rank) =>
  (parseInt(pointsReq, 10) + parseInt(rank, 10));

export const isMasteryAvailable = ({ branchState, masteryState, mastery }) => {
  const { name, pointsReq, branch, rank } = mastery;
  // Return false if no points left
  if (calculatePointsLeft(branchState) < 0) {
    // Return false if offlineMasterydata is not active
    return (masteryState[name] && masteryState[name].activePoints > 0);
  }

// Mastery has enough points required by branch
  if (pointsReq <= branchState[branch]) {
    // Mastery has enough points left per tier
    if (rankPointsSum(pointsReq, rank) <= branchState[branch]) {
      // Mastery had active points
      return (masteryState[name] && masteryState[name].activePoints > 0);
    }
    return true;
  }

  return false;
};
