export interface ExtractedImageResult {
  files: File[];
  replacedDescription: string;
}

export async function extractBase64Images(
  description: string
): Promise<ExtractedImageResult> {
  const base64Regex =
    /<img[^>]+src=["'](data:image\/[^;]+;base64,[^"']+)["'][^>]*>/g;

  const files: File[] = [];
  let replacedDescription = description;
  let match: RegExpExecArray | null;
  let index = 0;

  // Clone description to replace while iterating
  while ((match = base64Regex.exec(description)) !== null) {
    const base64Data = match[1];
    const fullImgTag = match[0];

    try {
      const file = base64ToFile(base64Data, `image-${index}.png`);
      files.push(file);

      // Create a new img tag with the placeholder that ends with />
      const placeholderTag = `<img src="$${index}$"/>`;

      // Replace the entire img tag in the description
      replacedDescription = replacedDescription.replace(
        fullImgTag,
        placeholderTag
      );

      index++;
    } catch (err) {
      console.error("Failed to convert base64 to file:", err);
    }
  }

  return { files, replacedDescription };
}

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid base64 format");

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
