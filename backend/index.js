import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';
import { nanoid } from "nanoid";


const app = express();
app.use(cors());
app.use(express.json());

//db con
mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Collection Schema - model
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: { type : Number, default:0 }
});

const Url = mongoose.model('Urls', urlSchema);

// API - Routes
app.post('/api/short', async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if(!originalUrl) return res.status(400).json({ error: "originalUrl error" });
        const shortUrl = nanoid(5);
        const url = new Url({ originalUrl, shortUrl });
        await url.save();
        return res.status(200).json({ message: "URL Generated", url: url });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });
        // console.log("url found", url);
        if(url) {
            url.clicks++;
            await url.save();
            return res.redirect(url.originalUrl);
        } else {
            return res.status(400).json({ error: "Url not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3002, ()=>{
    console.log("Server STARTED...PORT: 3002 !!!")
});