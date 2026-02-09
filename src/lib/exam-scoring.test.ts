/**
 * Unit tests for exam scoring logic.
 */
import { describe, it, expect } from 'vitest'
import { calculateExamScore } from './exam-scoring'

describe('calculateExamScore', () => {
    it('should calculate 100% for all correct answers', () => {
        const result = calculateExamScore({
            questions: [
                { id: 'q1', correct: 0 },
                { id: 'q2', correct: 2 },
                { id: 'q3', correct: 1 },
            ],
            answers: { q1: 0, q2: 2, q3: 1 },
        })

        expect(result.score).toBe(100)
        expect(result.passed).toBe(true)
        expect(result.correctCount).toBe(3)
        expect(result.totalQuestions).toBe(3)
    })

    it('should calculate 0% for all wrong answers', () => {
        const result = calculateExamScore({
            questions: [
                { id: 'q1', correct: 0 },
                { id: 'q2', correct: 2 },
            ],
            answers: { q1: 1, q2: 0 },
        })

        expect(result.score).toBe(0)
        expect(result.passed).toBe(false)
        expect(result.correctCount).toBe(0)
    })

    it('should pass at exactly 50%', () => {
        const result = calculateExamScore({
            questions: [
                { id: 'q1', correct: 0 },
                { id: 'q2', correct: 1 },
            ],
            answers: { q1: 0, q2: 99 },
        })

        expect(result.score).toBe(50)
        expect(result.passed).toBe(true)
    })

    it('should fail below 50%', () => {
        const result = calculateExamScore({
            questions: [
                { id: 'q1', correct: 0 },
                { id: 'q2', correct: 1 },
                { id: 'q3', correct: 2 },
            ],
            answers: { q1: 0, q2: 99, q3: 99 },
        })

        expect(result.score).toBe(33)
        expect(result.passed).toBe(false)
    })

    it('should throw for exam with no questions', () => {
        expect(() =>
            calculateExamScore({ questions: [], answers: {} })
        ).toThrow('Exam has no questions')
    })

    it('should handle unanswered questions as wrong', () => {
        const result = calculateExamScore({
            questions: [
                { id: 'q1', correct: 0 },
                { id: 'q2', correct: 1 },
            ],
            answers: { q1: 0 }, // q2 not answered
        })

        expect(result.score).toBe(50)
        expect(result.correctCount).toBe(1)
    })

    it('should handle single question exam', () => {
        const result = calculateExamScore({
            questions: [{ id: 'q1', correct: 3 }],
            answers: { q1: 3 },
        })

        expect(result.score).toBe(100)
        expect(result.passed).toBe(true)
        expect(result.totalQuestions).toBe(1)
    })

    it('should round scores correctly', () => {
        // 2 out of 3 = 66.666... → 67
        const result = calculateExamScore({
            questions: [
                { id: 'q1', correct: 0 },
                { id: 'q2', correct: 1 },
                { id: 'q3', correct: 2 },
            ],
            answers: { q1: 0, q2: 1, q3: 99 },
        })

        expect(result.score).toBe(67)
    })
})
