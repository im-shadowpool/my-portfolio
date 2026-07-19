import { client } from "@/tina/__generated__/client";
import PortfolioPreview from "@/components/sections/portfolio-preview";
import portfolioStaticData from "@/content/portfolio.json";

export default async function Home() {
  let result;
  try {




    result = await client.queries.portfolio({ relativePath: "portfolio.json" });
  } catch (error) {
    console.warn("TinaCMS query failed, falling back to static JSON data.", error);
    result = {
      data: {
        portfolio: portfolioStaticData as any,
      },
      query: "",
      variables: {},
    };
  }

  return (
    <PortfolioPreview
      data={result.data}
      query={result.query}
      variables={result.variables}
    />
  );
}
