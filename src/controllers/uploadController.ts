import { Request,Response } from "express";
import { bucket } from "../config/firebase";
import { v4 as uuidv4} from "uuid";

export async function uploadImage(req: Request, res:Response) {
    try {
        if(!req.file){
             return res.status(400).json({ error: "No file uploaded" });
        }

        const filename = `products/${Date.now()}_${uuidv4}`;
        const file = bucket.file(filename)

        const stream = file.createWriteStream({
            metadata:{
                contentType:req.file.mimetype,
                metadata:{
                    firebaseStorageDownloadTokens: uuidv4()
             }
            } 
        });

          stream.on("error", () =>
             res.status(500).json({ error: "Upload failed" })
         );

          stream.on("finish", async () => {
                const token = file?.metadata?.metadata?.firebaseStorageDownloadTokens;

            const publicUrl =
                `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${token}`;

                    res.json({
                        message: "Upload successful",
                        imageUrl: publicUrl,
                        storagePath: filename
                    });
    });
            stream.end(req.file.buffer);
} catch (err) {
    res.status(500).json({ error: "Server error" });
  }
    
    
}