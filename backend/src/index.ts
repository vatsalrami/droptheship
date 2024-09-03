import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateDHGateSearchQuery(
  productName: string,
  productDescription: string,
  productPrice: number
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates concise search queries for finding similar products on DHGate based on Amazon product information.",
        },
        {
          role: "user",
          content: `Given an Amazon product with the following details:
            Name: ${productName}
            Description: ${productDescription}
            Price: $${productPrice}
  
            Generate a concise search query for DHGate that would likely find similar products. 
            Focus on key product features and avoid brand names. The query should be 
            no longer than 5-7 words.`,
        },
      ],
      max_tokens: 50,
      n: 1,
      temperature: 0.7,
    });

    const searchQuery = response.choices[0].message.content?.trim();
    return searchQuery || "Error generating search query";
  } catch (error) {
    console.error("Error generating DHGate search query:", error);
    return "Error generating search query";
  }
}

async function main() {
  const productName = "Door Stopper";
  const productDescription =
    "High-quality sound, water-resistant, 24-hour battery life with charging case";
  const productPrice = 79.99;

  const searchQuery = await generateDHGateSearchQuery(
    productName,
    productDescription,
    productPrice
  );
  console.log("Generated DHGate search query:", searchQuery);
}

main().catch(console.error);
