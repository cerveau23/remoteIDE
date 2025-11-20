// noinspection InfiniteLoopJS

let target = ('');
export async function main(ns) {
  target = ns.args[0];
  while (true) {
    await ns.hack(target);
    await ns.grow(target);
    for (let i = 0; i < 3; i++) { 
      await ns.weaken(target);
    }
  }
}