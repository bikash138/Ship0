import { toast } from "sonner";

/**
 * Copies text to clipboard with user feedback
 * @param text - Text to copy
 * @param successMessage - Optional success message
 * @returns Promise that resolves to true if successful
 */
export const copyToClipboard = async (
  text: string,
  successMessage: string = "Copied to clipboard!"
): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch (error) {
    console.log(error);
    toast.error("Failed to copy to clipboard");
    return false;
  }
};
