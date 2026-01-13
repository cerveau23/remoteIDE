import {factorial, removeAll, arrayToString, stringToArray} from "/functions";

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function minimumPathSumInATriangle(ns, contractName, serverName) {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let answer;
    let k = contractData.length;
    if (k === (0 || 1)) {
        if (k === 0) {
            return 0
        } else {
            return contractData[0][0]
        }
    }
    let memoizationArray = Array(k).fill().map(() => Array(contractData[k - 1].length).fill(100000));
    memoizationArray[0][0] = contractData[0][0];
    for (let i = 1; i < k; i++) {
        memoizationArray[i][0] = contractData[i][0] + memoizationArray[i - 1][0]
        for (let b = 1; b < contractData[i].length; b++) {
            memoizationArray[i][b] = contractData[i][b] + Math.min(memoizationArray[i - 1][b], memoizationArray[i - 1][b - 1]);
        }
    }
    ns.print(contractData);
    ns.print(memoizationArray);
    answer = Math.min.apply(null, memoizationArray[k - 1]);
    ns.print(memoizationArray[k - 1])
    ns.print(answer)
    return answer;
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function uniquePathsInAGridI(ns, contractName, serverName, outsourceArray = []) {
    let contractData;
    if (outsourceArray.length !== 0) {
        contractData = outsourceArray;
    } else {
        contractData = ns.codingcontract.getData(contractName, serverName);
    }
    let k = contractData[0] + contractData[1] - 2;
    let answer = factorial(k) / (factorial(contractData[0] - 1) * factorial(contractData[1] - 1))
    return Math.round(answer);
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function uniquePathsInAGridII(ns, contractName, serverName) {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    if (!contractData.some((value, index) => value.includes(1))) {//Base case where there are no obstacles
        let answer = uniquePathsInAGridI(ns, "", "", [contractData.length, contractData[0].length]);
        return answer;
    }
    let n = contractData.length
    let m = contractData[0].length
    if ((contractData[0][0] || contractData[n - 1][m - 1]) === 1) {
        return 0
    }//Base case where there are obstacles on the start or the finish point

    //Surrounding the map with "walls"
    contractData.unshift(Array(m).fill(1));//Up-most wall
    for (let i of contractData) {
        i.unshift(1)
    }//Left-most wall

    n = contractData.length
    m = contractData[0].length

    //Changing 1 to 0 and vice versa
    for (let i in contractData) for (let j in contractData[i]) {
        contractData[i][j] = 1 - contractData[i][j]
    }

    //DP initialisation
    let dp = Array(n).fill(0).map(() => Array(m).fill(0));
    dp[1][1] = 1;

    //Calculations
    for (let i = 1; i < n; i++) {
        for (let j = 1; j < contractData[i].length; j++) {
            dp[i][j] += dp[i - 1][j] * contractData[i - 1][j] + dp[i][j - 1] * contractData[i][j - 1] //If [i-1][j] is an obstacle(simbolyzed by a 0), it will result in a 0 and not contribute to the value
        }
    }
    ns.print(dp)
    return dp[dp.length - 1][dp[dp.length - 1].length - 1]
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function shortestPathInAGridSelfMade(ns, contractName, serverName) {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    if (!contractData.some((value) => value.includes(1))) {//Base case where there are no obstacles
        let answer = String().concat("d".repeat(contractData.length - 1), "r".repeat(contractData[0].length - 1))
        return answer;
    }
    let n = contractData.length
    let m = contractData[0].length
    if ((contractData[0][0] || contractData[n - 1][m - 1]) === 1) {
        return ""
    }//Base case where there are obstacles on the start or the finish point

    //Surrounding the map with "walls"
    contractData.unshift(Array(m).fill(1));//Up-most wall
    for (let i of contractData) {
        i.unshift(1)
    }//Left-most wall
    contractData.push(Array(m).fill(1));//Down-most wall
    for (let i of contractData) {
        i.push(1)
    }//Right-most wall

    n = contractData.length
    m = contractData[0].length

    //DP initialisation
    let dp = Array(n).fill().map(() => Array(m).fill(""));
    dp[1][1] = ["O"];

    let directionDict = {"-1,0": "D", "0,-1": "R", "1,0": "U", "0,1": "L"}//What to add to the string depending on the position of the original string
    let calculationsBuffer = 0;
    let counter = 0;
    while (calculationsBuffer < 10) {
        //Calculations
        for (let i = 1; i < n - 1; i++) {
            for (let j = 1 + Math.floor(1 / i); j < m - 1; j++) {
                dp[i][j] = [""]
                for (let k of [[-1, 0], [0, -1], [1, 0], [0, 1]]) {
                    if ((contractData[i + k[0]][j + k[1]] === 0) && (dp[i + k[0]][j + k[1]].length !== 0)) {
                        dp[i][j].push(dp[i + k[0]][j + k[1]] + directionDict[k.toString()]);
                    }
                }
                if (dp[i][j].length !== 1) {
                    dp[i][j].shift()
                }//If there are some solutions, remove the default "" answer
                dp[i][j] = dp[i][j].sort((a, b) => {
                    return a.length - b.length
                })[0];
            }
        }
        dp[1][1] = "O";
        ns.print(dp);
        ns.print("Iteration " + counter);
        counter++;
        //await ns.sleep();
        if (dp[n - 2][m - 2] !== "") {
            calculationsBuffer++
        }//Once the terminus starts being reached by the calculations, we could end the loop, but I want it to loop a few more times to receive a few stragglers
        if (counter > n * m) {
            break;
        }//If after "Area" loops, no answer has been found, it's likely that there is no solution because of a wall
    }
    ns.print(dp)
    return dp[n - 2][m - 2].slice(1)//Returns the string without the initial O for "Origin"
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function shortestPathInAGrid(ns, contractName, serverName) {
    // Get the grid data from the contract
    let grid = ns.codingcontract.getData(contractName, serverName);
    let rows = grid.length;
    let cols = grid[0].length;
    // Base cases: start or end is blocked
    if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) {
        return "";
    }
    // Directions: Down, Right, Up, Left (corresponding UDLR)
    const directions = ['D', 'R', 'U', 'L'];
    const dx = [1, 0, -1, 0];  // change in row
    const dy = [0, 1, 0, -1];  // change in column
    // BFS setup
    let queue = [[0, 0, ""]]; // Store row, col, and path string
    let visited = Array.from({length: rows}, () => Array(cols).fill(false));
    visited[0][0] = true;
    // BFS loop
    while (queue.length > 0) {
        let [x, y, path] = queue.shift();
        // If we reach the bottom-right corner, return the path
        if (x === rows - 1 && y === cols - 1) {
            return path;
        }
        // Explore all 4 directions (Down, Right, Up, Left)
        for (let i = 0; i < 4; i++) {
            let newX = x + dx[i];
            let newY = y + dy[i];
            // Check if new position is within bounds and not visited or blocked
            if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && !visited[newX][newY] && grid[newX][newY] === 0) {
                visited[newX][newY] = true;  // Mark as visited
                queue.push([newX, newY, path + directions[i]]);  // Add new position to the queue
            }
        }
    }
    // If no path was found, return an empty string
    return "";
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function deathToParenthesesBroken(ns, contractName, serverName) {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let openers = ["(", "[", "{", "<"];
    let closers = [")", "]", "}", ">"];
    let arrayData = contractData.split("");
    let unprocessedAnswer = []
    ns.print(arrayData)
    arrayData = parenthesesTrimmer(arrayData);
    ns.print(arrayData)

    /** Treats the array to remove any unmatchable parentheses
     *  @param {string} arrayToTreatTemp
     *  @returns {string[]}*/
    function parenthesesMatcher(arrayToTreatTemp) {
        let workingArray = stringToArray(arrayToTreatTemp);
        workingArray = parenthesesTrimmer(workingArray);
        console.log(workingArray)
        let firstIndexesOpeners = []
        let lastIndexesClosers = []
        for (let i in openers) {
            firstIndexesOpeners[i] = workingArray.indexOf(openers[i]);
            lastIndexesClosers[i] = workingArray.lastIndexOf(closers[i]);
            if (firstIndexesOpeners[i] === -1) {
                firstIndexesOpeners[i] = workingArray.length - 1
            }
            if (lastIndexesClosers[i] === -1) {
                lastIndexesClosers[i] = 0
            }
        }
        console.log(firstIndexesOpeners)
        console.log(lastIndexesClosers)
        console.log(workingArray)
        for (let i in closers) {//Remove unmatched closers
            let subarray = workingArray.splice(0, firstIndexesOpeners[i]);
            workingArray.unshift(removeAll(subarray, closers[i]));
            workingArray = workingArray.flat()
        }
        console.log(workingArray)
        for (let i in openers) {//Remove unmatched openers
            let subarray = workingArray.splice(lastIndexesClosers[i], workingArray.length - lastIndexesClosers[i]);
            workingArray.push(removeAll(subarray, openers[i]));
            workingArray = workingArray.flat()
        }
        console.log(workingArray)
        return workingArray
    }

    /**@param {string[]} array
     * @return {string[]}
     */
    function parenthesesTrimmer(array) {
        while (closers.includes(array[0])) {
            array.shift()
        }
        while (openers.includes(array[array.length - 1])) {
            array.pop()
        }
        return array
    }

    /**
     * @param {string[]} workingArray
     * @returns {string[]}
     */
    function parenthesesWeddinger(workingArray) {
        console.log(workingArray);
        let nonParentheses = Array(workingArray.length).fill("");
        for (let i in workingArray) if (!(closers.includes(workingArray[i]) || openers.includes(workingArray[i]))) {
            nonParentheses[i] = workingArray[i]
        }
        console.log(nonParentheses)
        let dp = Array(workingArray.length).fill(0).map(() => []);
        for (let i = workingArray.length; i >= 0; i--) {
            if (openers.includes(workingArray[i])) {
                for (let b = workingArray.length; b >= i; b--) {
                    if (closers.includes(workingArray[b])) {
                        if (openers.indexOf(workingArray[i]) !== closers.indexOf(workingArray[b])) {
                            continue;
                        }
                        dp[i].push(b);
                    }
                }
            }
        }
        console.log(workingArray);
        console.log(dp)
        let noDuplicatesArray = [];
        let noDuplicatesDP = [];
        for (let i in dp) {//Remove duplicates
            let newAnswer = [];
            for (let b = 0; b < dp[i].length + nonParentheses.length; b++) {
                let addition = [];
                if (typeof dp[i][b] === typeof "string") {
                    newAnswer[dp[i][b]] = workingArray[dp[i][b]];
                    addition = workingArray[i];
                }
                if (nonParentheses[i] !== undefined) {
                    addition = nonParentheses[i]
                }
                newAnswer[i] = addition
            }
            if (!noDuplicatesDP.includes(newAnswer)) {
                noDuplicatesArray.push(dp[i]);
                noDuplicatesDP.push(newAnswer);
            } else {
                noDuplicatesArray.push([]);
            }
        }
        console.log(noDuplicatesArray)
        console.log(noDuplicatesDP)
        dp = noDuplicatesArray
        for (let i = 0; i < dp[0][0]; i++) for (let b in dp[i]) {
            let tempAnswerArray = Array(workingArray.length);
            tempAnswerArray[i] = workingArray[i];
            tempAnswerArray[dp[i][b]] = workingArray[dp[i][b]];
            for (let j = i + 1; j < dp.length; j++) for (let c in dp[j]) {
                if ((((j < dp[i][b]) && (c < dp[i][b])) || ((j > dp[i][b]) && (c > dp[i][b]))) && (tempAnswerArray[j] === tempAnswerArray[c])) {
                    for (let z = j; z < c; z++) {
                        tempAnswerArray[z] = j
                    }
                    tempAnswerArray[j] = workingArray[j];
                    tempAnswerArray[dp[j][c]] = workingArray[dp[j][c]];
                }
            }
            unprocessedAnswer.push(tempAnswerArray);
        }
        console.log(unprocessedAnswer)
        let answer = [];
        for (let i in unprocessedAnswer) {//Reintroduce the non-parentheses
            let newAnswer = "";
            for (let b = 0; b < unprocessedAnswer[i].length + nonParentheses.length; b++) {
                let addition = "";
                if (typeof unprocessedAnswer[i][b] === "string") {
                    addition = unprocessedAnswer[i][b]
                }
                if (nonParentheses[b] !== undefined) {
                    addition += nonParentheses[b]
                }
                newAnswer += addition
            }
            answer.push(newAnswer)
        }
        return answer
    }

    await ns.sleep(10);
    ns.print(arrayToString(arrayData))
    let newarrayData = parenthesesMatcher(arrayToString(arrayData));
    console.log("----------------")
    ns.print(newarrayData);
    let answer = parenthesesWeddinger(newarrayData);
    ns.print(answer)
    throw (Error);
    //return answer;
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function deathToParentheses(ns, contractName, serverName) {
    // Retrieve the initial contract data
    let contractData = ns.codingcontract.getData(contractName, serverName);

    const openers = ['(', '[', '{', '<'];
    const closers = [')', ']', '}', '>'];

    /**
     * Check if a string has balanced brackets of all types
     * @param {string[]} str
     * @returns {boolean}
     */
    function isValid(str) {
        let stack = [];
        for (let char of str) {
            if (openers.includes(char)) {
                stack.push(char);
            } else if (closers.includes(char)) {
                let expectedOpener = openers[closers.indexOf(char)];
                if (stack.pop() !== expectedOpener) {
                    return false;  // Mismatched closing bracket
                }
            }
        }
        return stack.length === 0;  // All open brackets should be closed
    }

    /**
     * Use BFS to generate all minimum valid bracket combinations
     * @param s
     * @returns {string[]}
     */
    function removeInvalidParentheses(s) {
        if (!s) return [""];  // Edge case for empty input

        let results = new Set();  // To store unique valid results
        let queue = [s];  // Initialize BFS queue with the original string
        let visited = new Set(queue);  // Track visited strings to avoid duplicates
        let foundValid = false;

        while (queue.length > 0) {
            let currentLevel = queue.length;  // Only process current level nodes
            for (let i = 0; i < currentLevel; i++) {
                let str = queue.shift();

                if (isValid(str)) {
                    results.add(str);  // Add valid configuration to results
                    foundValid = true;
                }

                if (foundValid) continue;  // Skip generating more strings if valid ones are found

                // Generate next level by removing one bracket at each position
                for (let j = 0; j < str.length; j++) {
                    if (!openers.includes(str[j]) && !closers.includes(str[j])) continue;
                    let newStr = str.slice(0, j) + str.slice(j + 1);
                    if (!visited.has(newStr)) {
                        visited.add(newStr);
                        queue.push(newStr);
                    }
                }
            }
            if (foundValid) break;  // Stop further processing once minimum valid solutions are found
        }

        return results.size > 0 ? Array.from(results) : [""];
    }

    // Call the function and pass the contractData to get the answer
    let answer = removeInvalidParentheses(contractData);
    return answer;
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function findAllValidMathExpressionsHomemade(ns, contractName, serverName) {
    let [baseString, targetNumber] = ns.codingcontract.getData(contractName, serverName);
    let operators = ["+", "-", "*"];
    if (parseInt(baseString) < targetNumber) {
        return []
    }
    let result = [];

    /** @param {Number} n
     *  @param {string} string
     *  @return {Array}*/
    function recursiveFunction(n, string) {
        if (n >= string.length - 1) {//Reached the end of the string
            if (isEqualToTarget(string)) {
                result.push(string);
                return;
            }
        }
        let stringSplit = [string.slice(0, n + 1), string.slice(n + 1)]
        for (let i in operators) {
            recursiveFunction(n + 2, stringSplit[0] + operators[i] + stringSplit[1]);
        }
        if (string[n] !== "0") {
            recursiveFunction(n + 1, string);
        }
    }

    /** @param {string} string
     *  @return {boolean}*/
    function no0First(string) {
        return !((string.charAt(0) === "0") && (string.length > 1));
    }

    /** @param {string} string
     *  @return {boolean}*/
    function isEqualToTarget(string) {
        for (let i in operators) {
            string.replaceAll(operators[i], " " + operators[i] + " ")
        }
        let array = string.split(" ");
        while (array.includes("*")) {
            let multPosition = array.indexOf("*");
            let subarray = array.splice(multPosition - 1, 3);
            array.splice(multPosition - 1, 0, subarray[0] * subarray[2]);
        }
        while (array.includes("-")) {
            let multPosition = array.indexOf("-");
            let subarray = array.splice(multPosition - 1, 3);
            array.splice(multPosition - 1, 0, subarray[0] - subarray[2]);
        }
        while (array.includes("+")) {
            let multPosition = array.indexOf("+");
            let subarray = array.splice(multPosition - 1, 3);
            array.splice(multPosition - 1, 0, subarray[0] + subarray[2]);
        }
        return array[0] === targetNumber
    }

    let answer = recursiveFunction(0, baseString);
    return answer;
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName */
export async function findAllValidMathExpressions(ns, contractName, serverName) {
    let [baseString, targetNumber] = ns.codingcontract.getData(contractName, serverName);
    let operators = ["+", "-", "*"];
    let results = [];  // Store all valid expressions

    /**
     * Recursive function to build expressions
     * @param {Number} pos
     * @param {string} currentExpr
     * @param {Number} currentVal
     * @param {Number} lastOperand
     */
    function recursiveFunction(pos, currentExpr, currentVal, lastOperand) {
        // Base case: reached the end of the string
        if (pos === baseString.length) {
            if (currentVal === targetNumber) {
                results.push(currentExpr);  // Add valid expression to results
            }
            return;
        }

        // Iterate through all possible sub-numbers from the current position
        for (let i = pos; i < baseString.length; i++) {
            let part = baseString.slice(pos, i + 1);

            // Skip numbers with leading zeros
            if (part.length > 1 && part[0] === "0") break;

            let partNum = parseInt(part);

            if (pos === 0) {
                // First number, no operator needed
                recursiveFunction(i + 1, part, partNum, partNum);
            } else {
                // Add '+', '-', or '*' operators between the segments
                recursiveFunction(i + 1, currentExpr + "+" + part, currentVal + partNum, partNum);
                recursiveFunction(i + 1, currentExpr + "-" + part, currentVal - partNum, -partNum);
                recursiveFunction(i + 1, currentExpr + "*" + part, currentVal - lastOperand + lastOperand * partNum, lastOperand * partNum);
            }
        }
    }

    // Start recursion with an empty expression
    recursiveFunction(0, "", 0, 0);
    return results;
}