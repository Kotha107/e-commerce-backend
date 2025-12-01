
import { Request, Response } from "express";
import { db } from "../config/firebase";

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, category, description, imageUrl } = req.body;
    if (!name || !price || !imageUrl) {
      return res.status(400).json({ error: "name, price, and imageUrl are required" });
    }

    const docRef = await db.collection("products").add({
      name,
      price,
      category: category || "uncategorized",
      description: description || "",
      imageUrl,
      createdAt: new Date()
    });

    const saved = await docRef.get();
    return res.status(201).json({ id: docRef.id, ...saved.data() });
  } catch (err: any) {
    console.error("Create product error:", err);
    return res.status(500).json({ error: "Create product failed", details: err.message || err });
  }
}

export async function listProducts(req: Request, res: Response) {
  try {
    const snap = await db.collection("products").orderBy("createdAt", "desc").get();
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(products);
  } catch (err: any) {
    console.error("List products error:", err);
    return res.status(500).json({ error: "List failed", details: err.message });
  }
}
