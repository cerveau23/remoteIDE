import {part1} from "beeper/beepPart1";
import {part2} from "beeper/beepPart2";
/**
 * Makes a sound
 * @param {NS} ns
 * */
export async function main(ns) {
	ns.flags([["ram-override", 26.6]]);
	ns.ramOverride(26.6)
	let arg = part1(ns.args[0])
	ns.ramOverride(33.6)
	part2(arg)
}
/**export async function main(ns) {
	playBeep(ns.args);
}
export default function playBeep(tone = 440) {
	// Create an audio context
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	// Create an oscillator (used to generate sound)
	const oscillator = audioCtx.createOscillator();

	// Set the oscillator frequency (beep tone frequency in Hz)
	oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime); // 440Hz is the standard A4 note

	// Create a gain node to control the volume
	const gainNode = audioCtx.createGain();

	// Connect the oscillator to the gain node
	oscillator.connect(gainNode);

	// Connect the gain node to the audio context destination (the speakers)
	gainNode.connect(audioCtx.destination);

	// Start the oscillator
	oscillator.start();

	// Stop the sound after 0.5 seconds
	oscillator.stop(audioCtx.currentTime + 0.1);
}*/