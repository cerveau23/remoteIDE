/**
 * @param tone
 * @returns {[AudioContext,OscillatorNode,GainNode]}
 */
export default function part1(tone = 440): [AudioContext, OscillatorNode, GainNode] {
	// Create an audio context
	/** @type{AudioContext} */
	const audioCtx: AudioContext = new (window.AudioContext /*|| window.webkitAudioContext*/)();

	// Create an oscillator (used to generate sound)
	/**@type {OscillatorNode}*/
	const oscillator: OscillatorNode = audioCtx.createOscillator();
	// Set the oscillator frequency (beep tone frequency in Hz)
	oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime); // 440Hz is the standard A4 note

	// Create a gain node to control the volume
	/** @type {GainNode} */
	const gainNode: GainNode = audioCtx.createGain();

	// Return the created variables
	return[audioCtx,oscillator,gainNode];
}