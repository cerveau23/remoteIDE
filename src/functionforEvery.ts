/**
 * Adds two numbers together.
 * @param {Function} operation - The first number.
 * @param {any[]} array - The second number.
 * @param {any[]} args
 */
function forEvery(array: any[], operation: Function, ...args: any[]){
    for (let i in array){
        operation (array[i],i,array, args)
    }
}