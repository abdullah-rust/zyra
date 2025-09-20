import multer from "multer";
import path from "path";
import minioClient from "../clients/minio";

const upload = multer({ storage: multer.memoryStorage() });

// File upload karne ke liye POST route
app.post(
  "/upload",
  upload.single("myFile"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res.status(400).send("No file was uploaded.");
      }

      const file = req.file;
      const bucketName = "chat-app-files";

      const bucketExists = await minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await minioClient.makeBucket(bucketName, "us-east-1");
        console.log(`Bucket '${bucketName}' created successfully.`);
      }

      const uniqueFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}${path.extname(file.originalname)}`;

      await minioClient.putObject(
        bucketName,
        uniqueFileName,
        file.buffer,
        file.size,
        {
          "Content-Type": file.mimetype,
        }
      );

      console.log(`File '${uniqueFileName}' uploaded to MinIO successfully.`);

      res.status(200).json({
        message: "File uploaded to MinIO successfully!",
        fileName: uniqueFileName,
        bucket: bucketName,
      });
    } catch (error) {
      console.error("Error during file upload:", error);
      res.status(500).send("An error occurred during file upload.");
    }
  }
);

// Naya route: MinIO se file download karne ke liye
app.get(
  "/download/:fileName",
  async (req: Request, res: Response): Promise<any | any> => {
    try {
      const { fileName }: any = req.params;
      const bucketName = "chat-app-files";

      // File stream ko MinIO se get karein
      const dataStream = await minioClient.getObject(bucketName, fileName);

      // Content-Disposition header set karein taake browser file ko download kare
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      // Data stream ko response stream mein pipe kar dein
      dataStream.pipe(res);

      // Connection close hone par log karein
      dataStream.on("end", () => {
        console.log(`File '${fileName}' downloaded successfully.`);
      });
    } catch (error) {
      // Agar file nahi mili to 404 error dein
      if (error instanceof Error && error.message.includes("NoSuchKey")) {
        return res.status(404).send("File not found.");
      }
      console.error("Error during file download:", error);
      res.status(500).send("An error occurred during file download.");
    }
  }
);
