import { PrismaClient } from "@prisma/client";
import snoowrap from "snoowrap";

// const reddit = new snoowrap({
//   userAgent: "QOTD Bot by /u/Free_Cash8050", // A description of your bot
//   clientId: "pRo9hPnXAcuTWnaYYXjVhA",
//   clientSecret: `${process.env.REDDIT_SECRET}`,
//   username: "Free_Cash8050",
//   password: `${process.env.REDDIT_ACC_PASS}`,
// });

export class ApiClient {
  constructor(private prisma: PrismaClient, private reddit: snoowrap) {}

  async getQuestionOfTheDay(today: Date) {
    let response = await this.prisma.questionOfTheDay.findUnique({
      where: { date: today },
      include: {
        question: {
          include: {
            tags: true, // Include the tags of the associated question
          },
        },
      },
    });

    return response;
  }

  async getUnusedQuestions() {
    let response = await this.prisma.question.findMany({
      where: {
        date_used: null, // Ensure the question has not been used
        link: null,
      },
    });

    return response;
  }

  async getAllQuestions() {
    let response = await this.prisma.question.findMany({
      include: {
        tags: true,
      },
    });

    return response;
  }

  async getEarliestUsed() {
    let response = await this.prisma.question.findFirst({
      orderBy: {
          date_used: 'asc'
      }
  });

  return response;
  }

  async updateQuestionToUsed(selectedQuestionId: number, today: Date) {
    let response = await this.prisma.question.update({
      where: { id: selectedQuestionId},
      data: {
        date_used: today, // Set the `date_used` field to today
      },
    });
  
    return response;
  }

  async createQuestionOfTheDay(selectedQuestionId: number, today: Date) {
    let response = await this.prisma.questionOfTheDay.create({
      data: {
        questionId: selectedQuestionId,
        date: today,
      },
    });

    return response;
  }

  async createRedditPost(selectedQuestionId: number, selectedQuestionText: string, subredditName: string) {
    // @ts-ignore
    let response: any = await this.reddit.getSubreddit(subredditName).submitSelfpost({
      title: selectedQuestionText,
      text: `Here's a link back to the question: https://www.hashtagdeep.com/questions/${selectedQuestionId}`,
    }) 

    return response;
  }

  async updateQuestionRedditLink(selectedQuestionId: number, postName: string) {
    let response = await this.prisma.question.update({
      where: { id: selectedQuestionId },
      data: {
        link: postName, // Store the Reddit post URL
      },
    });

    return response;
  }
}
