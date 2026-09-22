import confetti from 'canvas-confetti';

export function triggerStarConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#F59E0B', '#FBBF24', '#F472B6', '#34D399', '#60A5FA'],
    shapes: ['star', 'circle'],
    ticks: 200,
  });
}

export function triggerRewardCelebration() {
  const end = Date.now() + 1.2 * 1000;
  const colors = ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
