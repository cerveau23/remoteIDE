/** @param {NS} ns */
export async function main(ns) {
	let flag = ns.flags([["c", ".js"], ["u", "Nope"], ["help", false]]);
	if (flag.help) {
		ns.tprintRaw(`The openAllScripts script is used to get a command line to open all scripts in the editor, as the name suggests.
It has 3 possible flags:
\t-c, for "contains", requires a string and will return only scripts that contain that string in their name.
\t-u, for "uses", requires a string and will return only scripts that contain that string in their code.
\t--help will display this screen.`);
		ns.exit();
	}
	let answer = "home; nano ";
	let files = ns.ls("home", flag.c);
	files = files.filter(function (a) { return a.endsWith(".js") });
	if (flag.u !== "Nope") {
		files = files.filter(function (a) {
			let file = ns.read(a);
			return file.includes(flag.u);
		});
	}
	for (let i of files) {
		answer += i + " ";
	}
	ns.tprintRaw(answer);
}