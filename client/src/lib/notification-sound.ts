let audioContext: AudioContext | null = null;
let audioEnabled = false;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export async function playNotificationSound() {
  try {
    const context = getAudioContext();
    
    if (context.state === 'suspended') {
      try {
        await context.resume();
        audioEnabled = true;
      } catch (error) {
        if (!audioEnabled) {
          console.warn('Audio autoplay blocked. User interaction required.');
        }
        return;
      }
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.setValueAtTime(800, context.currentTime);
    oscillator.frequency.setValueAtTime(600, context.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
}

if (typeof window !== 'undefined') {
  const enableAudioOnInteraction = async () => {
    if (!audioEnabled) {
      try {
        const context = getAudioContext();
        if (context.state === 'suspended') {
          await context.resume();
          audioEnabled = true;
        }
      } catch (error) {
        console.warn('Failed to enable audio:', error);
      }
    }
  };

  ['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, enableAudioOnInteraction, { once: true });
  });
}
