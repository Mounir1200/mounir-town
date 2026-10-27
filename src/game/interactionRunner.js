// Executes what an interactable does. New action types plug in here
// without touching the game loop.
export function createInteractionRunner({ i18n, panels, dialogue, sound, progress, toasts }) {
  const handlers = {
    async panel(target) {
      if (progress.visit(target.id)) toasts.show(i18n.t('toast.newPlace', { name: i18n.pick(target.label) }));
      const followUp = await panels.open(target.action.id);
      if (!followUp && progress.hasAllPlaces && progress.celebrateOnce('places')) await dialogue.play('allPlaces');
      return followUp;
    },

    async dialogue(target) {
      await dialogue.play(target.action.script);
    },

    async music() {
      const isWorking = await sound.toggle();
      if (!isWorking) toasts.show(i18n.t('toast.musicError'));
      else toasts.show(i18n.t(sound.isOn ? 'toast.musicOn' : 'toast.musicOff'));
    },
  };

  return target => handlers[target.action.type](target);
}
