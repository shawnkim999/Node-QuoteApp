import { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient";
import { Quote } from "../models/QuoteModel";
import { getCache, setCache, deleteCache } from "../services/redisService";

// get all quotes
export const getAllQuotes = async (req:Request, res:Response): Promise<void> => {
    try {
        const cachedQuotes = await getCache<Quote[]>("quotes");
        if (cachedQuotes) {
            res.json(cachedQuotes);
            return;
        }

        const { data: quotes, error } = await supabase
            .from("quotes")
            .select("*");

        if (error) throw error;

        res.json(quotes);
    } catch (error) {
        console.error("Failed to get all quotes: ", error);
        res.status(500).json(({ error: "Failed to retrieve quotes" }))
    }
}

// get one quote
export const getQuoteById = async (req:Request, res:Response): Promise<void> => {
    const quoteId = req.params.id;
    try {
        const cachedQuote = await getCache<Quote>(`quote:${quoteId}`);
        if (cachedQuote) {
            res.json(cachedQuote);
            return;
        }

        const { data: quote, error } = await supabase
            .from("quotes")
            .select("*")
            .eq("id", quoteId)
            .single();

        if (error) {
            res.status(404).json({ error: "Quote not found" });
            return;
        }

        await setCache(`quote:${quoteId}`, 'quote');
        res.json(quote);
    } catch (error) {
        console.error("Failed to get quote by id:", error);
        res.status(500).json({ error: "Failed to get quote by id" });
    }
}

export const likeQuote = async (req:Request, res:Response): Promise<void> => {
    const quoteId = req.params.id;
    try {
        const { data: quote, error } = await supabase
            .from("quotes")
            .select("likes")
            .eq("id", quoteId)
            .single();

        if (error || !quote) {
            res.status(404).json({ error: "Quote likes not found" })
            return
        }

        const { data: updatedQuote, error: updateError } = await supabase
            .from("quotes")
            .update({ likes: (quote.likes || 0) + 1 })
            .eq("id", quoteId)
            .select()
            .single();
        
        if (updateError) throw updateError;

        await setCache(`quote:${quoteId}`, "quote");
        
        res.status(200).json(updatedQuote);
    } catch (error) {
        
    }
}