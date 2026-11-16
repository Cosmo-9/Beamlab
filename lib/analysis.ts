export type BeamInputs = { length: number; pointLoad: number; pointPosition: number; udl: number };
export type BeamResults = {
  reactionA: number; reactionB: number; totalLoad: number; maxMoment: number; maxShear: number;
  samples: { x: number; shear: number; moment: number }[];
};
export function analyseBeam(input: BeamInputs): BeamResults {
  const { length, pointLoad, pointPosition, udl } = input;
  const reactionB = (pointLoad * pointPosition + udl * length * length / 2) / length;
  const reactionA = pointLoad + udl * length - reactionB;
  const samples = Array.from({ length: 121 }, (_, index) => {
    const x = length * index / 120;
    const shear = reactionA - (x >= pointPosition ? pointLoad : 0) - udl * x;
    const moment = reactionA * x - pointLoad * Math.max(0, x - pointPosition) - udl * x * x / 2;
    return { x, shear, moment };
  });
  return {
    reactionA, reactionB, totalLoad: pointLoad + udl * length,
    maxMoment: Math.max(0, ...samples.map(s => s.moment)),
    maxShear: Math.max(...samples.map(s => Math.abs(s.shear))), samples
  };
}
