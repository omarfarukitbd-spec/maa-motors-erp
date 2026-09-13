/**
 * 📦 SkillRegistry — Central Hub for Dynamic Jarvis Extensibility
 * Enables adding new skills seamlessly without touching core logic.
 */
export class SkillRegistry {
    constructor() {
        this.skills = new Map();
        this.listeners = [];
    }

    /**
     * Register a new skill instance
     * @param {BaseSkill} skill 
     */
    register(skill) {
        if (!skill || !skill.id) {
            console.error('Invalid skill registration:', skill);
            return;
        }
        this.skills.set(skill.id, skill);
        console.log(`[SkillRegistry] Registered skill: "${skill.name}" (${skill.id})`);
        this.notifyListeners();
    }

    /**
     * Get a skill by ID
     */
    get(skillId) {
        return this.skills.get(skillId);
    }

    /**
     * Get all registered skills
     */
    getAll() {
        return Array.from(this.skills.values());
    }

    /**
     * Get all Gemini tool definitions aggregated across all active skills
     */
    getAllTools() {
        const tools = [];
        for (const skill of this.skills.values()) {
            const skillTools = skill.getTools();
            if (Array.isArray(skillTools)) {
                tools.push(...skillTools);
            }
        }
        return tools;
    }

    /**
     * Find the best matching skill for a user prompt via trigger keywords
     */
    findMatchingSkill(queryText) {
        for (const skill of this.skills.values()) {
            if (skill.matches(queryText)) {
                return skill;
            }
        }
        return null;
    }

    /**
     * Execute an action on the appropriate skill
     */
    async executeAction(toolName, params = {}, context = {}) {
        for (const skill of this.skills.values()) {
            const tools = skill.getTools();
            const hasTool = tools.some(t => t.name === toolName);
            if (hasTool) {
                return await skill.execute(toolName, params, context);
            }
        }
        throw new Error(`কোনো স্কিলে "${toolName}" টুলটি খুঁজে পাওয়া যায়নি।`);
    }

    onChange(fn) {
        this.listeners.push(fn);
    }

    notifyListeners() {
        const list = this.getAll();
        this.listeners.forEach(fn => {
            try {
                fn(list);
            } catch (err) {
                console.warn('[SkillRegistry] Listener error:', err);
            }
        });
    }
}

export const skillRegistry = new SkillRegistry();
