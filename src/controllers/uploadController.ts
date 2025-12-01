import { Request,Response } from "express";
import axios  from "axios";
import FormData from "form-data";



export async function uploadImage( req:Request, res:Response){
    try{
        if(!req.file){
            return res.status(400).json({error:"No file uploaded"});
        }

        const apiKey = process.env.IMGBB_API_KEY;
        if(!apiKey){
            return res.status(500).json({ error: "ImgBB API key not configured"});

        }
        const form = new FormData();
        form.append("image",req.file.buffer.toString("base64"));

        const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
        const response = await axios.post(url,form,{ headers: form.getHeaders() } );

        const data = response.data;
        if(!data || !data.success){
            return res.status(500).json({ error: "ImgBB upload failed", details: data });
    }

    const imageUrl = data.data.url;
    const deleteUrl = data.data.deleteUrl

    return res.json({imageUrl,deleteUrl,raw:data})
    }
    catch (err: any) {
    console.error("ImgBB upload error:", err.response?.data || err.message || err);
    return res.status(500).json({ error: "Upload failed", details: err.response?.data || err.message });
  }
}