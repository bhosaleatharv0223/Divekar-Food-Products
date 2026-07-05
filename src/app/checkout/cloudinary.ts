const CLOUD_NAME = "dollittbh";
const UPLOAD_PRESET = "Divekar bills"; // exact match, including the space and capitalization

export async function uploadBillToCloudinary(imageBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", imageBlob);
  formData.append("upload_preset", UPLOAD_PRESET);

  console.log("Cloudinary upload preset payload:", JSON.stringify(UPLOAD_PRESET));
  console.log("Cloudinary file blob details:", {
    type: imageBlob?.type,
    size: imageBlob?.size,
    isBlob: imageBlob instanceof Blob,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      `Cloudinary upload failed (${res.status}): ${JSON.stringify(errorBody)}`
    );
  }

  const data = await res.json();
  return data.secure_url as string;
}