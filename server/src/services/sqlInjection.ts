export class SQLInjectionDetectorService {
  public async detectSQLInjection(expression: string): Promise<boolean> {
    const sqlInjectionPatterns = [
      /\b(or|and|union|select|insert|update|delete|drop|exec|exec\(|shutdown|script)\b/i,
      /(--|#|;)/,
      /\/\*.*\*\//,
      /\b\d+\s*=\s*\d+\b/,
      /\s*=\s*--/,
      /('|"|`)/,
    ];
    for (let pattern of sqlInjectionPatterns) {
      if (pattern.test(expression)) {
        return true;
      }
    }
    return false;
  }
}
