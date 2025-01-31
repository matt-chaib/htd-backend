import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the Prisma Client
jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    questionOfTheDay: { findUnique: jest.fn(), create: jest.fn() },
    question: { findMany: jest.fn(), update: jest.fn() },
  })),
}));

// Mock Snoowrap
jest.unstable_mockModule('snoowrap', () => ({
  default: jest.fn(() => ({
    getSubreddit: jest.fn().mockReturnValue({
      submitSelfpost: jest.fn(),
    }),
  })),
}));

// Import the service and dependencies
const { getQuestionOfTheDay } = await import('../../src/service/questionService.js');
const { PrismaClient } = await import('@prisma/client');
const snoowrap = await import('snoowrap');

describe('getQuestionOfTheDay', () => {
  let prismaMock, redditMock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    prismaMock = new PrismaClient();
    redditMock = new snoowrap.default();
  });

  it('returns a random unused question if no question is set for today', async () => {
    // Mock `findMany` to return unused questions
    prismaMock.question.findMany.mockResolvedValue([
      { id: 1, text: 'Unused Question 1', link: null, date_used: null, tags: [] },
      { id: 2, text: 'Unused Question 2', link: null, date_used: null, tags: [] },
    ]);

    const result = await getQuestionOfTheDay();

    // Verify `findMany` was called with the correct filter
    expect(prismaMock.question.findMany).toHaveBeenCalledWith({
      where: { date_used: null, link: null },
    });

    // Verify the result contains one of the mocked unused questions
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        text: expect.stringMatching(/Unused Question/),
      })
    );

    console.log("Result:", result); // Log for debugging
  });

  // it('fetches a random unused question if no question exists for today', async () => {
  //   prismaMock.questionOfTheDay.findUnique.mockResolvedValue(null);
  //   prismaMock.question.findMany.mockResolvedValue([{ id: 2, text: 'Unused Question' }]);
  //   prismaMock.question.update.mockResolvedValue();

  //   const result = await getQuestionOfTheDay();
  //   expect(result).toEqual({ id: 2, text: 'Unused Question' });
  //   expect(prismaMock.question.findMany).toHaveBeenCalled();
  // });

  // it('posts to Reddit if the selected question has no link', async () => {
  //   prismaMock.questionOfTheDay.findUnique.mockResolvedValue(null);
  //   prismaMock.question.findMany.mockResolvedValue([{ id: 3, text: 'Post to Reddit', link: null }]);
  //   prismaMock.question.update.mockResolvedValue();
  //   redditMock.getSubreddit().submitSelfpost.mockResolvedValue({
  //     name: 'reddit_post_id',
  //   });

  //   const result = await getQuestionOfTheDay();
  //   expect(redditMock.getSubreddit().submitSelfpost).toHaveBeenCalled();
  //   expect(prismaMock.question.update).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       data: { link: 'reddit_post_id' },
  //     })
  //   );
  // });

  // it('handles errors gracefully', async () => {
  //   prismaMock.questionOfTheDay.findUnique.mockRejectedValue(new Error('Database error'));

  //   await expect(getQuestionOfTheDay()).rejects.toThrow('Could not fetch question of the day');
  // });
});
