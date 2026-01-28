/**
 * Concierge Voice Audit Tool (DEV ONLY)
 * Checks all voice keys across all 6 languages for completeness
 */

import { loadConciergeFlowConfig } from './conciergeFlowConfig';
import { Lang } from '../i18n';

const LANGUAGES: Lang[] = ['en', 'fr', 'de', 'es', 'it', 'pt'];

interface AuditResult {
    path: 'student' | 'guest';
    section: string;
    topic?: string;
    lang: Lang;
    issue: 'missing' | 'empty';
    key: string;
}

export function auditConciergeVoiceKeys(): AuditResult[] {
    const config = loadConciergeFlowConfig();
    const issues: AuditResult[] = [];

    // Audit both student and guest paths
    (['student', 'guest'] as const).forEach(path => {
        const pathConfig = config[path];

        // Check main voice line sections
        const sections: Array<{ key: string, data: Record<Lang, string[]> }> = [
            { key: 'welcomeLines', data: pathConfig.welcomeLines },
            { key: 'askFirstTimeLines', data: pathConfig.askFirstTimeLines },
            { key: 'firstTimeConfirmLines', data: pathConfig.firstTimeConfirmLines },
            { key: 'returningConfirmLines', data: pathConfig.returningConfirmLines },
            { key: 'backLines', data: pathConfig.backLines },
            { key: 'idleLines', data: pathConfig.idleLines }
        ];

        // Add student-only section
        if (path === 'student') {
            sections.push({ key: 'studentOnboardingLines', data: (pathConfig as any).studentOnboardingLines });
        }

        // Check each section for all languages
        sections.forEach(section => {
            LANGUAGES.forEach(lang => {
                const lines = section.data[lang];
                if (!lines) {
                    issues.push({
                        path,
                        section: section.key,
                        lang,
                        issue: 'missing',
                        key: `${path}.${section.key}[${lang}]`
                    });
                } else if (lines.length === 0) {
                    issues.push({
                        path,
                        section: section.key,
                        lang,
                        issue: 'empty',
                        key: `${path}.${section.key}[${lang}]`
                    });
                }
            });
        });

        // Check topic intros
        Object.keys(pathConfig.topicIntros).forEach(topicId => {
            const topicIntro = pathConfig.topicIntros[topicId];
            LANGUAGES.forEach(lang => {
                const lines = topicIntro?.[lang];
                if (!lines) {
                    issues.push({
                        path,
                        section: 'topicIntros',
                        topic: topicId,
                        lang,
                        issue: 'missing',
                        key: `${path}.topicIntros.${topicId}[${lang}]`
                    });
                } else if (lines.length === 0) {
                    issues.push({
                        path,
                        section: 'topicIntros',
                        topic: topicId,
                        lang,
                        issue: 'empty',
                        key: `${path}.topicIntros.${topicId}[${lang}]`
                    });
                }
            });
        });
    });

    return issues;
}

export function printConciergeAudit() {
    console.log('\n=== CONCIERGE VOICE AUDIT ===\n');

    const issues = auditConciergeVoiceKeys();

    if (issues.length === 0) {
        console.log('✅ All voice keys present for all 6 languages (EN, FR, DE, ES, IT, PT)');
        return;
    }

    console.log(`❌ Found ${issues.length} voice key issue(s):\n`);

    // Group by path
    const byPath = issues.reduce((acc, issue) => {
        if (!acc[issue.path]) acc[issue.path] = [];
        acc[issue.path].push(issue);
        return acc;
    }, {} as Record<string, AuditResult[]>);

    Object.entries(byPath).forEach(([path, pathIssues]) => {
        console.log(`  ${path.toUpperCase()} PATH:`);

        // Group by section
        const bySection = pathIssues.reduce((acc, issue) => {
            const sectionKey = issue.topic ? `${issue.section}.${issue.topic}` : issue.section;
            if (!acc[sectionKey]) acc[sectionKey] = [];
            acc[sectionKey].push(issue);
            return acc;
        }, {} as Record<string, AuditResult[]>);

        Object.entries(bySection).forEach(([section, sectionIssues]) => {
            console.log(`    ${section}:`);
            sectionIssues.forEach(issue => {
                const symbol = issue.issue === 'missing' ? '🔴' : '🟡';
                console.log(`      ${symbol} ${issue.lang.toUpperCase()}: ${issue.issue}`);
            });
        });
        console.log('');
    });

    console.log('=== END AUDIT ===\n');
}
