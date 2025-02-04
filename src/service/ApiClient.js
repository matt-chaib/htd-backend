// const reddit = new snoowrap({
//   userAgent: "QOTD Bot by /u/Free_Cash8050", // A description of your bot
//   clientId: "pRo9hPnXAcuTWnaYYXjVhA",
//   clientSecret: `${process.env.REDDIT_SECRET}`,
//   username: "Free_Cash8050",
//   password: `${process.env.REDDIT_ACC_PASS}`,
// });
export class ApiClient {
    prisma;
    reddit;
    constructor(prisma, reddit) {
        this.prisma = prisma;
        this.reddit = reddit;
    }
    async getQuestionOfTheDay(today) {
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
    async updateQuestionToUsed(selectedQuestionId, today) {
        let response = await this.prisma.question.update({
            where: { id: selectedQuestionId },
            data: {
                date_used: today, // Set the `date_used` field to today
            },
        });
        return response;
    }
    async createQuestionOfTheDay(selectedQuestionId, today) {
        let response = await this.prisma.questionOfTheDay.create({
            data: {
                questionId: selectedQuestionId,
                date: today,
            },
        });
        return response;
    }
    async createRedditPost(selectedQuestionId, selectedQuestionText, subredditName) {
        // @ts-ignore
        let response = await this.reddit.getSubreddit(subredditName).submitSelfpost({
            title: selectedQuestionText,
            text: `Here's a link back to the question: https://www.hashtagdeep.com/questions/${selectedQuestionId}`,
        });
        return response;
    }
    async updateQuestionRedditLink(selectedQuestionId, postName) {
        let response = await this.prisma.question.update({
            where: { id: selectedQuestionId },
            data: {
                link: postName, // Store the Reddit post URL
            },
        });
        return response;
    }
}
