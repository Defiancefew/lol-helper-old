import { reduce } from 'lodash';

export const calculatePointsLeft = (branchState) =>
  (30 - (reduce(branchState, (prev, next) => prev + next) + 1));

export const rankPointsSum = (pointsReq, rank) =>
  (parseInt(pointsReq, 10) + parseInt(rank, 10));
