const noteFretFeatures = [
  {
    note: "E2",
    string: "0",
    fret: "0",
    pitch: 82.49617700218863,
    rms: 0.08659129210198177,
    spectralCentroid: 0.19400626483986413,
    spectralRolloff: 17.526313287589083,
    spectralSlope: 8.600091945983722e-8,
  },
  {
    note: "F2",
    string: "0",
    fret: "1",
    pitch: 0,
    rms: 0,
    spectralCentroid: 0,
    spectralRolloff: 0,
    spectralSlope: 0,
  },
];

// {
//   note: "F#2",
//   string: "0",
//   fret: "2",
//   pitch: ...,
//   rms: ...,
//   spectralCentroid: ...,
//   spectralRolloff: ...,
//   spectralSlope: ...,
// },

const mostSimilarFeatures = (features) => {
  // scan file for most similar features
  // and output key value
};

export { noteFretFeatures, mostSimilarFeatures };
