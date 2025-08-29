import { Router } from "express";
import {
    getAllQuotes,
    getQuoteById,
    likeQuote
} from '../controllers/quotesController';

const router = Router();

router.get("/", getAllQuotes);
router.get("/:id", getQuoteById);
router.post("/:id/like", likeQuote);

export default router;