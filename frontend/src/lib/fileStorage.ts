interface StoredFile {
  name: string;
  type: string;
  dataUrl: string;
}

interface StoredDraft {
  policy: StoredFile | null;
  images: StoredFile[];
}

const MAX_STORED_BYTES = 3 * 1024 * 1024;

function fileToStoredFile(file: File): Promise<StoredFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result as string });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function storedFileToFile(stored: StoredFile): File {
  const base64 = stored.dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], stored.name, { type: stored.type });
}

export async function saveDraftFiles(key: string, policyFile: File | null, images: File[]): Promise<void> {
  try {
    const draft: StoredDraft = { policy: null, images: [] };
    if (policyFile && policyFile.size <= MAX_STORED_BYTES) {
      draft.policy = await fileToStoredFile(policyFile);
    }
    for (const image of images) {
      if (image.size <= MAX_STORED_BYTES) {
        draft.images.push(await fileToStoredFile(image));
      }
    }
    sessionStorage.setItem(key, JSON.stringify(draft));
  } catch {
    sessionStorage.removeItem(key);
  }
}

export function loadDraftFiles(key: string): { policyFile: File | null; images: File[] } {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return { policyFile: null, images: [] };
    const draft = JSON.parse(raw) as StoredDraft;
    return {
      policyFile: draft.policy ? storedFileToFile(draft.policy) : null,
      images: draft.images.map(storedFileToFile),
    };
  } catch {
    return { policyFile: null, images: [] };
  }
}
