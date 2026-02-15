import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const pincerDecoration = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        backgroundColor: 'rgba(52, 152, 219, 0.08)',
        border: '0 0 0 3px dashed #3498db',
        after: { 
            contentText: '  ◀ vClaw: Scope Captured', 
            color: '#3498db', 
            fontWeight: 'bold' 
        }
    });

    function getIndent(lineIdx: number, document: vscode.TextDocument): number {
        if (lineIdx < 0 || lineIdx >= document.lineCount) return -1;
        const line = document.lineAt(lineIdx);
        return line.isEmptyOrWhitespace ? 999 : line.firstNonWhitespaceCharacterIndex;
    }

    function findScope(level: 'content' | 'parent' | 'grandparent') {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const currentLineIdx = editor.selection.active.line;
        const langId = document.languageId;
        
        let startLine = -1;
        let endLine = -1;

        const isTagBased = ['html', 'xml', 'php', 'jsx', 'tsx'].includes(langId);
        const isBraceBased = ['javascript', 'typescript', 'json', 'c', 'cpp', 'csharp', 'java', 'css', 'scss'].includes(langId);

        const solveByIndent = (targetLevel: string, startFrom: number): number => {
            const currentIndent = getIndent(startFrom, document);
            let s = -1;

            if (targetLevel === 'content') {
                let nextIdx = startFrom + 1;
                while (nextIdx < document.lineCount && document.lineAt(nextIdx).isEmptyOrWhitespace) nextIdx++;
                const nextIndent = getIndent(nextIdx, document);
                const nextText = nextIdx < document.lineCount ? document.lineAt(nextIdx).text.trim() : "";
                
                if (nextIndent > currentIndent || (nextIndent === currentIndent && nextText.startsWith('-'))) {
                    s = startFrom;
                } else {
                    for (let i = startFrom - 1; i >= 0; i--) {
                        if (getIndent(i, document) < currentIndent && getIndent(i, document) !== -1) { s = i; break; }
                    }
                }
            } else if (targetLevel === 'parent') {
                for (let i = startFrom - 1; i >= 0; i--) {
                    const indent = getIndent(i, document);
                    if (indent !== -1 && indent < currentIndent) { s = i; break; }
                }
            }
            return s;
        };

        // --- HİYERARŞİ BELİRLEME ---
        if (level === 'content') {
            startLine = solveByIndent('content', currentLineIdx);
        } else if (level === 'parent') {
            startLine = solveByIndent('parent', currentLineIdx);
        } else if (level === 'grandparent') {
            const parent = solveByIndent('parent', currentLineIdx);
            if (parent !== -1) {
                startLine = solveByIndent('parent', parent);
                if (startLine === -1) startLine = parent; // Dede yoksa babada kal (Root koruması)
            } else {
                startLine = currentLineIdx; // Zaten en üstteysen orayı seç
            }
        }

        // --- AKILLI BİTİŞ HESABI ---
        if (startLine !== -1) {
            const startLineObj = document.lineAt(startLine);
            const startIndent = getIndent(startLine, document);
            const startText = startLineObj.text.trim().toLowerCase();
            endLine = startLine;

            // Etiket ismi ayıklama (örn: <body> -> body)
            let tagName = "";
            if (isTagBased && startText.startsWith('<') && !startText.startsWith('</')) {
                const match = startText.match(/^<([a-z0-9-]+)/i);
                if (match) tagName = match[1];
            }

            for (let i = startLine + 1; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                if (line.isEmptyOrWhitespace) continue;
                
                const lineIndent = getIndent(i, document);
                const lineText = line.text.trim().toLowerCase();

                // 1. Girinti bariz azaldıysa blok bitti
                if (lineIndent < startIndent) break;

                // 2. Girinti aynıysa özel kontrol
                if (lineIndent === startIndent) {
                    if (!startText.startsWith('-') && lineText.startsWith('-')) {
                        endLine = i; continue; // YAML Liste devamı
                    }
                    if (isBraceBased && lineText.startsWith('}')) {
                        endLine = i; break; // JS Kapanış
                    }
                    if (isTagBased && tagName && lineText.startsWith(`</${tagName}`)) {
                        endLine = i; break; // HTML Kapanış
                    }
                    break;
                }
                endLine = i;
            }

            // HTML Root İstisnası (html etiketi seçildiyse sona kadar git)
            if (tagName === 'html') {
                endLine = document.lineCount - 1;
            }

            const range = new vscode.Range(startLine, 0, endLine, document.lineAt(endLine).text.length);
            editor.setDecorations(pincerDecoration, [range]);
        }
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('vclaw.markContent', () => findScope('content')),
        vscode.commands.registerCommand('vclaw.markParent', () => findScope('parent')),
        vscode.commands.registerCommand('vclaw.markGrandparent', () => findScope('grandparent')),
        vscode.commands.registerCommand('vclaw.clearMarks', () => {
            if (vscode.window.activeTextEditor) {
                vscode.window.activeTextEditor.setDecorations(pincerDecoration, []);
            }
        })
    );
}

export function deactivate() {}