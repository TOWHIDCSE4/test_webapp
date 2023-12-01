export enum ENUM_MEMO_NOTE_FIELD {
    listening = 'listening',
    speaking = 'speaking',
    vocabulary = 'vocabulary',
    grammar = 'grammar',
    avg_score = 'avg_score'
}
export enum ENUM_MEMO_OTHER_NOTE_FIELD {
    strength = 'strength',
    weakness = 'weakness',
    another_comment = 'another_comment',
    attention = 'attention',
    comprehension = 'comprehension',
    performance = 'performance'
}

export const MEMO_OTHER_NOTE_FIELD = [
    ENUM_MEMO_OTHER_NOTE_FIELD.strength,
    ENUM_MEMO_OTHER_NOTE_FIELD.weakness,
    ENUM_MEMO_OTHER_NOTE_FIELD.another_comment,
    ENUM_MEMO_OTHER_NOTE_FIELD.attention,
    ENUM_MEMO_OTHER_NOTE_FIELD.comprehension,
    ENUM_MEMO_OTHER_NOTE_FIELD.performance
]

export const MEMO_NOTE_FIELD = [
    ENUM_MEMO_NOTE_FIELD.listening,
    ENUM_MEMO_NOTE_FIELD.speaking,
    ENUM_MEMO_NOTE_FIELD.vocabulary,
    ENUM_MEMO_NOTE_FIELD.grammar,
    ENUM_MEMO_NOTE_FIELD.avg_score
]

export enum EnumScoreClassification {
    POOR = 3.5,
    AVERAGE = 5.5,
    GOOD = 8,
    VERY_GOOD = 10,
    EXCELLENT = 10
}

export const TEACHER_SCHEDULED_MEMO_FIELD = [
    'attendance',
    'attitude',
    'homework'
]

export const MAX_HOUR_MEMO = 12 // 12h everyday

export const MAX_HOUR_TRIAL_MEMO = 8 // 8h everyday
