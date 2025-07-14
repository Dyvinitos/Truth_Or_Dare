'use server';

import fs from 'fs/promises';
import path from 'path';

export async function addEntry(type: 'truth' | 'dare', text: string) {
  const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
  
  try {
    let content = await fs.readFile(dataFilePath, 'utf8');

    const newEntryString = `  "${text.replace(/"/g, '\\"')}",\n`;

    if (type === 'truth') {
      const truthRegex = /(export const initialTruths: string\[\] = \[)([\s\S]*?)(\];)/;
      if (!truthRegex.test(content)) {
        throw new Error('initialTruths array not found in data.ts');
      }
      content = content.replace(truthRegex, `$1$2${newEntryString}$3`);
    } else {
      const dareRegex = /(export const initialDares: string\[\] = \[)([\s\S]*?)(\];)/;
      if (!dareRegex.test(content)) {
         throw new Error('initialDares array not found in data.ts');
      }
      content = content.replace(dareRegex, `$1$2${newEntryString}$3`);
    }

    await fs.writeFile(dataFilePath, content, 'utf8');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to add entry:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}
