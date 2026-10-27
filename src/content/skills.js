// Collectible skills hidden around town; each one appears in the portfolio content.
export const SKILLS = [
  { id: 'python', name: 'Python' },
  { id: 'fastapi', name: 'FastAPI' },
  { id: 'react', name: 'React' },
  { id: 'rag', name: 'RAG' },
  { id: 'mcp', name: 'MCP' },
  { id: 'azure', name: 'Azure' },
  { id: 'aws', name: 'AWS' },
  { id: 'big-data', name: 'Big Data' },
];

export function skillById(id) {
  return SKILLS.find(skill => skill.id === id);
}
