const playTone = (frequency: number, duration = 0.18) => {
  if (typeof window === 'undefined') return
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextClass) return

  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.value = 0.12

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
  oscillator.stop(context.currentTime + duration)

  oscillator.onended = () => {
    context.close()
  }
}

export const playCorrectSound = () => {
  playTone(660, 0.2)
}

export const playWrongSound = () => {
  playTone(220, 0.25)
}
