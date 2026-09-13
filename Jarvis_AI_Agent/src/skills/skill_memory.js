import { BaseSkill } from './base_skill.js';
import { memoryVault } from '../core/memory_vault.js';

export class MemorySkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_memory',
            name: 'দীর্ঘমেয়াদী স্মৃতিভাণ্ডার স্কিল',
            description: 'মালিকের নতুন কোনো নির্দেশ, নিয়ম বা তথ্য স্থায়ীভাবে মনে রাখে ও সংরক্ষণ করে।',
            triggers: ['মনে রাখবা', 'মনে রেখো', 'নোট নাও', 'মনে রাখো', 'সেভ করো', 'ভুলে যেও না', 'আমার পছন্দ']
        });
    }

    getTools() {
        return [
            {
                name: 'remember_fact',
                description: 'মালিকের বলে দেওয়া কোনো নতুন নিয়ম, ব্যবসায়িক তথ্য বা পছন্দ স্মৃতিতে সংরক্ষণ করে।',
                parameters: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            description: 'যে কথা বা নিয়মটি মনে রাখতে বলা হয়েছে'
                        },
                        category: {
                            type: 'string',
                            enum: ['fact', 'preference', 'rule'],
                            description: 'তথ্যের ধরন (তথ্য, পছন্দ নাকি নিয়ম)'
                        }
                    },
                    required: ['content']
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        const content = params.content || '';
        const category = params.category || 'fact';

        if (!content) {
            return {
                success: false,
                spokenResponse: 'কী মনে রাখতে হবে তা স্পষ্ট নয় ভাইয়া।'
            };
        }

        const newMem = await memoryVault.addMemory(category, content, ['voice_input', 'owner_rule']);

        return {
            success: true,
            spokenResponse: `জি ভাইয়া, আমি আপনার এই নির্দেশটি স্থায়ীভাবে মনে রেখেছি: "${content}"। পরবর্তীতে কাজের সময় আমি এটি স্মরণে রাখব।`,
            displayData: { savedMemory: newMem }
        };
    }
}
