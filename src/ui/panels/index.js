import { DATA_INTRO, EXPERIENCE_INTRO } from '../../content/experiences.js';
import { renderContact } from './contactPanel.js';
import { renderAirport, renderSchool } from './educationPanels.js';
import { createExperiencePanel } from './experiencePanel.js';
import { renderHome, renderMuseum } from './lifePanels.js';
import { renderProjects } from './projectsPanel.js';

// Content renderer of each building, keyed by location id.
export const PANEL_RENDERERS = {
  home: renderHome,
  lab: renderProjects,
  essca: createExperiencePanel('essca', EXPERIENCE_INTRO),
  tower: createExperiencePanel('moov', DATA_INTRO),
  school: renderSchool,
  airport: renderAirport,
  museum: renderMuseum,
  post: renderContact,
};
