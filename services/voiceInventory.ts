/**
 * Voice File Inventory Tool
 * Checks which MP3 files exist vs what's expected based on conciergeFlowConfig
 */

import { loadConciergeFlowConfig } from './conciergeFlowConfig';
import { Lang } from '../i18n';
import * as fs from 'fs';
import * as path from 'path';

const LANGUAGES: Lang[] = ['en', 'fr', 'de', 'es', 'it', 'pt'];

interface ExpectedVoiceFile {
    scriptId: string;
    lang: Lang;
    path: 'student' | 'guest';
    section: string;
    topic?: string;
    expectedPath: string;
}

export function getExpectedVoiceFiles(): ExpectedVoiceFile[] {
    const expected: ExpectedVoiceFile[] = [];

    // Topic intro files for both paths
    (['student', 'guest'] as const).forEach(path => {
        const config = loadConciergeFlowConfig();
        const pathConfig = config[path];

        // Get all topic IDs
        Object.keys(pathConfig.topicIntros).forEach(topicId => {
            LANGUAGES.forEach(lang => {
                const scriptId = `${path}_topic_${topicId}`;
                expected.push({
                    scriptId,
                    lang,
                    path,
                    section: 'topicIntros',
                    topic: topicId,
                    expectedPath: `/voice/${scriptId}_${lang}.mp3`
                });
            });
        });
    });

    // Welcome files
    LANGUAGES.forEach(lang => {
        expected.push({
            scriptId: 'welcome',
            lang,
            path: 'guest',
            section: 'welcome',
            expectedPath: `/voice/welcome_${lang}.mp3`
        });
    });

    return expected;
}

export function checkVoiceFilesExist(publicDir: string): {
    existing: string[];
    missing: ExpectedVoiceFile[];
    unexpected: string[];
} {
    const expected = getExpectedVoiceFiles();
    const voiceDir = path.join(publicDir, 'voice');

    let actualFiles: string[] = [];
    try {
        actualFiles = fs.readdirSync(voiceDir).filter(f => f.endsWith('.mp3'));
    } catch (e) {
        console.error('Could not read voice directory:', e);
    }

    const expectedPaths = new Set(expected.map(e => e.expectedPath.replace('/voice/', '')));
    const actualSet = new Set(actualFiles);

    const existing = actualFiles.filter(f => expectedPaths.has(f));
    const missing = expected.filter(e => !actualSet.has(e.expectedPath.replace('/voice/', '')));
    const unexpected = actualFiles.filter(f => !expectedPaths.has(f));

    return { existing, missing, unexpected };
}

export function printVoiceInventory(publicDir: string) {
    console.log('\n=== VOICE FILE INVENTORY ===\n');

    const { existing, missing, unexpected } = checkVoiceFilesExist(publicDir);

    console.log(`✅ Existing: ${existing.length} files`);
    console.log(`❌ Missing: ${missing.length} files`);
    console.log(`⚠️  Unexpected: ${unexpected.length} files`);

    if (missing.length > 0) {
        console.log('\n❌ MISSING FILES:');

        // Group by topic
        const byTopic = missing.reduce((acc, file) => {
            const key = file.topic || file.section;
            if (!acc[key]) acc[key] = [];
            acc[key].push(file);
            return acc;
        }, {} as Record<string, ExpectedVoiceFile[]>);

        Object.entries(byTopic).forEach(([topic, files]) => {
            console.log(`\n  ${topic}:`);
            files.forEach(f => {
                console.log(`    ${f.path}/${f.lang}: ${f.expectedPath}`);
            });
        });
    }

    if (unexpected.length > 0 && unexpected.length < 20) {
        console.log('\n⚠️  UNEXPECTED FILES (not in config):');
        unexpected.forEach(f => console.log(`    ${f}`));
    }

    console.log('\n=== END INVENTORY ===\n');
}
