/**
 * Adds two numbers together.
 * @param {Function} operation - The first number.
 * @param {any[]} array - The second number.
 */
function forEvery(array, operation, ...args){
    for (let i in array){
        operation (array[i],i,array, args)
    }
}