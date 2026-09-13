/**
 * 🧩 BaseSkill — Abstract Foundation for All Jarvis Skills
 * Every new skill must extend this class to ensure 100% interoperability and safety.
 */
export class BaseSkill {
    constructor({ id, name, description, triggers = [] }) {
        if (!id || !name) {
            throw new Error('BaseSkill requires both id and name');
        }
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.triggers = triggers; // Array of Bengali voice keywords/patterns
    }

    /**
     * Return list of functions/tools this skill provides for Gemini Function Calling
     * @returns {Array<Object>}
     */
    getTools() {
        return [];
    }

    /**
     * Check if a voice query matches this skill's triggers
     * @param {string} text 
     * @returns {boolean}
     */
    matches(text) {
        const lower = (text || '').toLowerCase();
        return this.triggers.some(t => lower.includes(t.toLowerCase()));
    }

    /**
     * Execute a specific action
     * @param {string} actionName 
     * @param {Object} params 
     * @param {Object} context 
     * @returns {Promise<{success: boolean, spokenResponse: string, displayData?: any}>}
     */
    async execute(actionName, params = {}, context = {}) {
        throw new Error(`execute() not implemented for skill ${this.id}`);
    }
}
