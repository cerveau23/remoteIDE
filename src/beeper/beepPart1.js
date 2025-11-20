export default function part1(tone = 440) {
	// Create an audio context
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	// Create an oscillator (used to generate sound)
	const oscillator = audioCtx.createOscillator();
	// Set the oscillator frequency (beep tone frequency in Hz)
	oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime); // 440Hz is the standard A4 note

	// Create a gain node to control the volume
	const gainNode = audioCtx.createGain();

	// Return the created variables
	return[audioCtx,oscillator,gainNode];
}