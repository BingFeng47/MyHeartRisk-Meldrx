import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-presigned-post";

const s3 = new S3Client({
    region: "ap-southeast-1", // Change to your AWS region
    credentials: {
        accessKeyId: "AKIARSU7KQVM67QOQ37Z",
        secretAccessKey: "TirRjtEYzueOQ1UTjnQbhePn9l+CmH/y5em8eNUq"
    }
});

async function uploadXmlToS3(xmlContent:any) {
    const bucketName = "meldrx-hackathon";
    const fileName = `reports/${Date.now()}.xml`;

    try {
        // Upload the XML content to S3
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: xmlContent,
            ContentType: "application/xml",
        });

        await s3.send(command);

        // Construct the public URL
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
        console.log("File uploaded to:", fileUrl);
        return fileUrl;
    } catch (error) {
        console.error("Upload failed:", error);
        throw new Error("Failed to upload XML to S3");
    }
}

export { uploadXmlToS3 };