// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

interface RegMathRes extends RegExpMatchArray {
  index: number;
  [index: number]: any;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension is now active!');
  
  // currently, we use the * for the DocumentSelector, need to change in the future
  const definitionProvider = vscode.languages.registerDefinitionProvider('*', {
    provideDefinition(
      document: vscode.TextDocument,
      position: vscode.Position,
      token: vscode.CancellationToken
    ) {
			console.log("I an in registerDefinitionProvider");
      const workDir: string = path.dirname(document.fileName);

      const lineText: string = document.lineAt(position).text;

      // if the selected line is not a import line , just return null
      if (!lineText.includes('import')) {
        return null;
      }

      let pathStrRes: RegMathRes | null = lineText.match(/('|")(\S+)\1/);

      if (!pathStrRes) {
        return null;
      }

      const sassFileSuffix: Array<string> = ['.sass', '.scss'];
      const sassFilePath: string = pathStrRes[2];
      const suffix: string = path.extname(sassFilePath);

      if (!sassFileSuffix.includes(suffix)) {
        return null;
      }

      const startPosition: vscode.Position = new vscode.Position(
        position.line,
        pathStrRes.index
      );
      const endPosition: vscode.Position = new vscode.Position(
        position.line,
        pathStrRes.index + sassFilePath.length
      );

      if (position.isBefore(startPosition) || position.isAfter(endPosition)) {
        return null;
      }

      const destPath: string = path.resolve(workDir, sassFilePath);
      return new vscode.Location(
        vscode.Uri.file(destPath),
        new vscode.Position(0, 0)
      );
    },
  });

  context.subscriptions.push(definitionProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {}
