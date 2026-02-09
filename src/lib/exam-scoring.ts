/**
 * Pure exam scoring logic — extracted for testability.
 * No database dependencies.
 */

export interface ScoringInput {
    questions: { id: string; correct: number }[]
    answers: Record<string, number>
}

export interface ScoringResult {
    score: number
    passed: boolean
    correctCount: number
    totalQuestions: number
}

/**
 * Calculate exam score from questions and submitted answers.
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
        if (answers[q.id] === q.correct) {
            correctCount++
        }
    })

    const score = Math.round((correctCount / totalQuestions) * 100)
    const passed = score >= 50

    return { score, passed, correctCount, totalQuestions }
}
