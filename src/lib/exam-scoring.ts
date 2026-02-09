/**
 * Pure exam scoring logic — extracted for testability.
 * No database dependencies.
 * Supports both single-choice and multi-select questions.
 */

export interface ScoringInput {
    questions: { id: string; correct: number[] }[]
    answers: Record<string, number[]>
}

export interface ScoringResult {
    score: number
    passed: boolean
    correctCount: number
    totalQuestions: number
}

/**
 * Calculate exam score from questions and submitted answers.
 * A question is correct only if ALL correct options are selected
 * and NO incorrect options are selected.
 * @throws Error if exam has no questions
 */
export function calculateExamScore(input: ScoringInput): ScoringResult {
    const { questions, answers } = input
    const totalQuestions = questions.length

    if (totalQuestions === 0) {
        throw new Error('Exam has no questions')
    }

    let correctCount = 0
    questions.forEach((q) => {
        const userAnswers = answers[q.id] ?? []
        const correctSet = new Set(q.correct)
        const userSet = new Set(userAnswers)

        // Check: same size AND all user answers are in correct set
        if (correctSet.size === userSet.size && userAnswers.every(a => correctSet.has(a))) {
            correctCount++
        }
    })

    const score = Math.round((correctCount / totalQuestions) * 100)
    const passed = score >= 50

    return { score, passed, correctCount, totalQuestions }
}
