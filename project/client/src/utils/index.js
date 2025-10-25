// Type definitions as JSDoc comments for better IDE support

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {StudyCategory} category
 * @property {boolean} isBookmarked
 * @property {string[]} highlights
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {string[]} tags
 */

/**
 * @typedef {Object} StudyCategory
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {string} color
 * @property {string} description
 * @property {number} totalNotes
 * @property {number} completedTopics
 * @property {number} totalTopics
 * @property {Date} [lastStudied]
 */

/**
 * @typedef {Object} ProgressData
 * @property {string} categoryId
 * @property {number} completionPercentage
 * @property {number} studyStreak
 * @property {number} totalStudyTime
 * @property {ActivityItem[]} recentActivity
 */

/**
 * @typedef {Object} ActivityItem
 * @property {string} id
 * @property {'note_created' | 'note_updated' | 'topic_completed' | 'category_created'} type
 * @property {string} title
 * @property {Date} timestamp
 * @property {string} categoryId
 */

/**
 * @typedef {Object} AIsuggestion
 * @property {string} id
 * @property {'next_topic' | 'review' | 'concept_explanation'} type
 * @property {string} title
 * @property {string} description
 * @property {'high' | 'medium' | 'low'} priority
 * @property {string} categoryId
 */

export {};