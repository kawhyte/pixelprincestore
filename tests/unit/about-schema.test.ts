import { describe, it, expect } from "vitest";
import { generateAboutPageSchema } from "@/lib/seo";

describe("generateAboutPageSchema", () => {
  const schema = generateAboutPageSchema();

  it("is an AboutPage node", () => {
    expect(schema["@type"]).toBe("AboutPage");
    expect(schema["@context"]).toBe("https://schema.org");
  });

  it("has a Person mainEntity named Kenny Whyte", () => {
    expect(schema.mainEntity["@type"]).toBe("Person");
    expect(schema.mainEntity.name).toBe("Kenny Whyte");
  });

  it("links the Person to the Organization and external profiles", () => {
    expect(schema.mainEntity.worksFor["@type"]).toBe("Organization");
    expect(schema.mainEntity.sameAs).toContain("https://www.meetthewhytes.com/");
    expect(schema.mainEntity.sameAs).toContain("https://thepixelprince.etsy.com");
  });
});
