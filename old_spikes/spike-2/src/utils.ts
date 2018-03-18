export const reduce = (f, xs, init = undefined) => {
  let acc = init;
  for (let x of xs) {
    if (acc === undefined) { acc = x; continue; }
    acc = f(acc, x);
  }
  return acc;
};
