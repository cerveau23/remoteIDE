// noinspection InfiniteLoopJS

let target = ('');
export async function main(ns) {
  target = ns.args[0];
  while (true) {
    await ns.weaken(target);
  }
}