let sharedContext = null;

// Created lazily: browsers only allow audio after a user gesture.
export function getAudioContext() {
  if (sharedContext) return sharedContext;
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    sharedContext = new AudioContextClass();
  } catch {
    sharedContext = null;
  }
  return sharedContext;
}

export async function resumeAudioContext() {
  const context = getAudioContext();
  if (context?.state === 'suspended') await context.resume().catch(() => {});
  return context;
}
