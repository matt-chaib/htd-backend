import { ApiClient } from "../../src/service/ApiClient"
import { describe, expect, it, jest, beforeEach } from '@jest/globals';


describe("ApiClient", () => {
  it("should fetch the question of the day", async () => {
    const mockPrisma = {
      questionOfTheDay: {
        findUnique: jest.fn().mockResolvedValue({
          date: new Date(),
          question: { text: "What is truth?", tags: [{ name: "philosophy" }] },
        }),
      },
    };
    const mockReddit = {
      getSubreddit: {
        submitSelfpost: jest.fn().mockResolvedValue({
          title: "What is truth?",
          text: "`Here's a link back to the question: https://www.hashtagdeep.com/questions/1"
        })
      }
    }

    const api = new ApiClient(mockPrisma, mockReddit);
    const result = await api.getQuestionOfTheDay(new Date());

    expect(result).toEqual({
      date: expect.any(Date),
      question: { text: "What is truth?", tags: [{ name: "philosophy" }] },
    });
    expect(mockPrisma.questionOfTheDay.findUnique).toHaveBeenCalled();
  });
});
