
import { ApiClient } from "./ApiClient.js";

export class QuestionService {
  constructor(private apiClient: ApiClient, private snoowrap: any) {}

  async getQuestionOfTheDay() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let existingQotd = await this.apiClient.getQuestionOfTheDay(today);
    if (existingQotd) {
      return existingQotd.question;
    }

    let unusedQuestions = await this.apiClient.getUnusedQuestions();

    let selectedQuestion;

    if (unusedQuestions && unusedQuestions.length > 0) {
      // Randomly select an unused question
      const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
      selectedQuestion = unusedQuestions[randomIndex];
    } else {
      // If all questions have been used, get the earliest question
      selectedQuestion = await this.apiClient.getEarliestUsed();
    }

    if (!selectedQuestion) {
      return null;
  }

    this.apiClient.updateQuestionToUsed(selectedQuestion.id, today);

    this.apiClient.createQuestionOfTheDay(selectedQuestion.id, today);

    if (!selectedQuestion.link) {
      try {
        const post = await this.apiClient.createRedditPost(selectedQuestion.id, selectedQuestion.text, "hashtagdeep")
        console.log(post);
        console.log(post.url);
        console.log(post.name);
        console.log(JSON.stringify(post));

       this.apiClient.updateQuestionRedditLink(selectedQuestion.id, post.name)
        console.log(
          `Posted successfully! View it here: ${JSON.stringify(post)}`
        );
      } catch (error) {
        console.error("Failed to post question of the day:", error);
      }
    }

    return selectedQuestion;
  }
}

// export async function getQuestionOfTheDay() {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Ensure the date is at midnight for comparison

//   console.log("getting question of the day");
//   const subredditName = "hashtagdeep"; // Replace with your subreddit

//   try {
//     // Step 1: Check if a question is already assigned for today
//     const existingQotd = await prisma.questionOfTheDay.findUnique({
//       where: { date: today },
//       include: {
//         question: {
//           include: {
//             tags: true, // Include the tags of the associated question
//           },
//         },
//       },
//     });

//     if (existingQotd) {
//       return existingQotd.question; // Return the question if found
//     }

//     // Step 2: Fetch a random unused question
//     const unusedQuestions = await prisma.question.findMany({
//       where: {
//         date_used: null, // Ensure the question has not been used
//         link: null,
//       },
//     });

//     let selectedQuestion;

//     console.log("UNUSED QUESTIONS", unusedQuestions);

//     if (unusedQuestions && unusedQuestions.length > 0) {
//       // Randomly select an unused question
//       const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
//       selectedQuestion = unusedQuestions[randomIndex];
//     } else {
//       // If all questions have been used, select a random question from all
//       const allQuestions = await prisma.question.findMany({
//         include: {
//           tags: true,
//         },
//       });
//       if (!allQuestions) {
//         console.error(
//           "Error fetching question of the day: No questions found by Prisma"
//         );
//         throw new Error("Could not fetch question of the day");
//       }
//       console.log("ALL QUESTIONS", allQuestions);
//       const randomIndex = Math.floor(Math.random() * allQuestions.length);
//       console.log("RANDOM INDEX", randomIndex);
//       selectedQuestion = allQuestions[randomIndex];
//       console.log("SELECTED QUESTION", selectedQuestion);
//     }

//     await prisma.question.update({
//       where: { id: selectedQuestion.id },
//       data: {
//         date_used: today, // Set the `date_used` field to today
//       },
//     });

//     // Step 3: Insert the selected question into `QuestionOfTheDay`
//     await prisma.questionOfTheDay.create({
//       data: {
//         questionId: selectedQuestion.id,
//         date: today,
//       },
//     });

//     if (!selectedQuestion.link) {
//       try {
//         console.log("posting to reddit yippee");
//         const post = await reddit.getSubreddit(subredditName).submitSelfpost({
//           title: selectedQuestion.text,
//           text: `Here's a link back to the question: https://www.hashtagdeep.com/questions/${selectedQuestion.id}`,
//         });
//         console.log(post);
//         console.log(post.url);
//         console.log(post.name);
//         console.log(JSON.stringify(post));

//         await prisma.question.update({
//           where: { id: selectedQuestion.id },
//           data: {
//             link: post.name, // Store the Reddit post URL
//           },
//         });
//         console.log(
//           `Posted successfully! View it here: ${JSON.stringify(post)}`
//         );
//       } catch (error) {
//         console.error("Failed to post question of the day:", error);
//       }
//     }

//     return selectedQuestion; // Return the selected question
//   } catch (error) {
//     console.error("Error fetching question of the day:", error);
//     throw new Error("Could not fetch question of the day");
//   }
// }
