import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { QuestionService } from '../../src/service/questionService';


describe("QuestionService", () => {
  it("should return an existing question of the day if found", async () => {
    const mockApiClient = {
      getQuestionOfTheDay: jest.fn().mockResolvedValue({
        question: { id: 1, text: "Existing Question" },
      }),
      getUnusedQuestions: jest.fn().mockResolvedValue([]), // No unused questions
    };

    const service = new QuestionService(mockApiClient, {}); // No need for snoowrap here

    const result = await service.getQuestionOfTheDay();

    expect(result).toEqual({ id: 1, text: "Existing Question" });
    expect(mockApiClient.getQuestionOfTheDay).toHaveBeenCalled();
    expect(mockApiClient.getUnusedQuestions).not.toHaveBeenCalled(); // Shouldn't be called
  });

  it("should select a random unused question if no QOTD exists", async () => {
    const mockApiClient = {
      getQuestionOfTheDay: jest.fn().mockResolvedValue(null), // No existing QOTD
      getUnusedQuestions: jest.fn().mockResolvedValue([
        { id: 1, text: "Unused Question 1" },
        { id: 2, text: "Unused Question 2" },
      ]),
      updateQuestionToUsed: jest.fn().mockResolvedValue(null),
    };
  
    const service = new QuestionService(mockApiClient, {}); // No need for snoowrap
  
    const result = await service.getQuestionOfTheDay();
  
    expect(mockApiClient.getUnusedQuestions).toHaveBeenCalled();
    expect(mockApiClient.updateQuestionToUsed).toHaveBeenCalledWith(result.id, expect.any(Date));
  });

  it("should select from all questions, if no unused questions exist", async () => {
    const mockApiClient = {
      getQuestionOfTheDay: jest.fn().mockResolvedValue(null), // No existing QOTD
      getUnusedQuestions: jest.fn().mockResolvedValue([
      ]),
      updateQuestionToUsed: jest.fn().mockResolvedValue(null),
      getAllQuestions: jest.fn().mockResolvedValue([
        { id: 1, text: "Question 1" },
        { id: 2, text: "Question 2" },
      ])
    };
  
    const service = new QuestionService(mockApiClient, {}); // No need for snoowrap
  
    const result = await service.getQuestionOfTheDay();
  
    expect(mockApiClient.getAllQuestions).toHaveBeenCalled();
    expect(mockApiClient.updateQuestionToUsed).toHaveBeenCalledWith(result.id, expect.any(Date));
  });
});