enum GenerationStage {
  Submit,
  Quorum,

  // Voting in progress
  Vote,
  Majority,

  // Voting ended
  Over,
  Rejected,
  Accepted,
  Failed,
}

export { GenerationStage };
