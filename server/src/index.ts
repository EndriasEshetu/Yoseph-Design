import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  createOrder,
  updateOrderStatus,
  type Product,
  type Order,
  type OrderStatus,
} from "./store";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: true }));
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Simple admin auth (demo only – use proper auth in production)
const ADMIN_SECRET = "admin123";
const adminTokens = new Set<string>();

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (email === "admin@example.com" && password === ADMIN_SECRET) {
    const token = `admin-${Date.now()}`;
    adminTokens.add(token);
    return res.json({ token, user: { id: "1", email, role: "admin" } });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Image Upload endpoint
app.post("/api/upload", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      return res.status(500).json({ 
        error: "Cloudinary not configured", 
        message: "Please set up Cloudinary credentials in server/.env file" 
      });
    }

    // Upload to Cloudinary using buffer
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "yoseph-design/products",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file!.buffer);
    });

    res.json({ 
      url: result.secure_url,
      public_id: result.public_id 
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed", message: error.message });
  }
});

// Products (public read; admin write)
app.get("/api/products", (_req, res) => {
  res.json(getProducts());
});

app.get("/api/products/:id", (req, res) => {
  const p = getProductById(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

app.post("/api/products", requireAdmin, (req, res) => {
  const body = req.body as Omit<Product, "id">;
  const created = addProduct(body);
  res.status(201).json(created);
});

app.put("/api/products/:id", requireAdmin, (req, res) => {
  const updated = updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const ok = deleteProduct(req.params.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

// Orders (client create; admin read/update)
app.get("/api/orders", requireAdmin, (_req, res) => {
  res.json(getOrders());
});

app.post("/api/orders", (req, res) => {
  const body = req.body as Omit<Order, "id" | "date">;
  const created = createOrder(body);
  res.status(201).json(created);
});

app.put("/api/orders/:id/status", requireAdmin, (req, res) => {
  const { status } = req.body as { status: OrderStatus };
  const updated = updateOrderStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
