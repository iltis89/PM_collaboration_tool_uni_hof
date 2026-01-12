/**
 * Central re-export file for all server actions.
 * This maintains backward compatibility with existing imports from '@/app/actions'.
 * 
 * New code should import directly from the specific module:
 * import { login } from '@/app/actions/auth'
 */

// Auth
export {
    login,
    logout,
    changePassword,
    getCurrentUser,
    acceptPrivacy
} from './auth'

// Users (Admin)
export {
    getUsers,
    getAdminStats,
    createUser,
    deleteUser
} from './users'

// Content (Materials, Curriculum, News, Audio, Lectures)
export {
    getMaterials,
    createMaterial,
    deleteMaterial,
    getCurriculumTopics,
    createCurriculumTopic,
    updateCurriculumTopic,
    deleteCurriculumTopic,
    getNews,
    createNews,
    deleteNews,
    getNewsReactions,
    addNewsReaction,
    removeNewsReaction,
    getAudioSnippets,
    createAudioSnippet,
    deleteAudioSnippet,
    getLectures,
    createLecture,
    deleteLecture
} from './content'

// Exams
export {
    getExams,
    getExam,
    submitExam,
    getExamResults
} from './exams'

// Collaboration (Threads, Messages, Course Chat)
export {
    getThreads,
    getThread,
    createThread,
    updateThread,
    deleteThread,
    createMessage,
    updateMessage,
    deleteMessage,
    getCourseMessages,
    sendCourseMessage,
    updateCourseMessage,
    deleteCourseMessage
} from './collaboration'

// Dashboard
export {
    getDashboardData
} from './dashboard'
