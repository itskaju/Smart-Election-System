import { describe, it, expect, vi } from "vitest";
import { generateNimResponse } from "../services/aiService";

const chatCompletionCreate = vi.fn();

vi.mock("openai", () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: chatCompletionCreate,
      },
    },
  })),
}));

describe("Chatbot AI Integration", () => {
  it("should return a response from NVIDIA NIM", async () => {
    chatCompletionCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "Mocked NIM Response" } }],
    });

    const response = await generateNimResponse("Hello", "test-key", "en-US");

    expect(response).toBe("Mocked NIM Response");
  });

  it("should throw an error when NIM fails", async () => {
    chatCompletionCreate.mockRejectedValueOnce(new Error("API Error"));

    await expect(
      generateNimResponse("Hello", "invalid-key", "en-US"),
    ).rejects.toThrow("NVIDIA NIM: API Error");
  });
});
