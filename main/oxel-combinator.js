async function* OxelCombinator(oxel, arr, depth = arr.length) {
  const keys = Array.from(oxel.keys());

  // A helper function to generate all permutations of a given thread <array>
  async function* permutations(arr, depth = arr.length) {
    if (depth === 1) yield arr;
    else {
      for (let i = 0; i < depth; i++) {
        yield* permutations(arr, depth - 1);
        const j = depth % 2 ? 0 : i;
        [arr[j], arr[depth - 1]] = [arr[depth - 1], arr[j]];
      }
    }
  }

  for await (const perm of permutations(keys, depth)) {
    await oxel.weave(...perm);
    yield oxel;
  }
}
