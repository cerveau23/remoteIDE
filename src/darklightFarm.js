// noinspection InfiniteLoopJS

let target = ('darkweb');
export async function main(ns) {
  while (true) {
    for (let i = 0; i < 10; i++) { 
      await ns.grow(target);
    }
    await ns.sleep(10);
  }
}