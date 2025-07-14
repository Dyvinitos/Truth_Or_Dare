'use server';

// This is a placeholder for a real database or file storage.
// For now, it doesn't do anything to prevent hot-reloading.
export async function addEntry(type: 'truth' | 'dare', text: string) {
  try {
    // In a real application, you would save this to a database.
    // To prevent the app from reloading, we won't write to the file system during the game.
    console.log(`Adding ${type}: ${text}. This is not saved permanently.`);
    return { success: true };
  } catch (error) {
    console.error('Failed to add entry:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}
