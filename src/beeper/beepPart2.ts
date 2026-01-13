/**
 * @param [audioCtx]
 * @param [oscillator]
 * @param [gainNode]
 */
export default function part2([audioCtx, oscillator, gainNode] : [AudioContext, OscillatorNode, GainNode]) {
	// Connect the oscillator to the gain node
	oscillator.connect(gainNode);

	// Connect the gain node to the audio context destination (the speakers)
	gainNode.connect(audioCtx.destination);

	// Start the oscillator
	oscillator.start();

	// Stop the sound after 0.5 seconds
	oscillator.stop(audioCtx.currentTime + 0.1);
}