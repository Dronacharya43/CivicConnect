// Simple rule-based classifier mapping keywords to categories and severity
export function classifyIssue({ title = '', description = '' }) {
  const text = `${title} ${description}`.toLowerCase()
  const hasAny = (words) => words.some(w => text.includes(w))

  let category = 'other'
  if (hasAny(['pothole', 'road', 'street', 'sidewalk', 'traffic'])) category = 'road'
  else if (hasAny(['garbage', 'trash', 'waste', 'litter', 'cleanliness', 'dustbin'])) category = 'waste'
  else if (hasAny(['water', 'leak', 'sewage', 'drain', 'pipeline'])) category = 'water'
  else if (hasAny(['electric', 'power', 'streetlight', 'electricity', 'pole'])) category = 'electricity'

  let severity = 'non-urgent'
  if (hasAny(['accident', 'danger', 'blocked', 'fire', 'collapse', 'exposed wire', 'major'])) severity = 'urgent'

  const deptMap = {
    road: 'Public Works Department',
    waste: 'Solid Waste Management',
    water: 'Water Supply & Sewerage',
    electricity: 'Electricity Board',
    other: 'General Administration',
  }

  const department = deptMap[category]
  return { category, severity, department }
}
