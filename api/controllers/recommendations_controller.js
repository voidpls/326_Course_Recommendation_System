require('dotenv').config()
const db = require('../db');
const { GEMINI_API_KEY } = process.env
const { GoogleGenAI, Type, createPartFromUri } = require("@google/genai")
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
const completeCourseList = require('../../src/Services/course-details-page/complete_course_list.json')

exports.getRecommendations = async (req, res, next) => {
    let { userId, userInterests } = req.body;
    try {
        userId = parseInt(userId)
        const user = await databaseGetCourses(userId)
        if (!user) return res.status(500).json({success: false, error: "Could not find courses for user"})

        const courses = JSON.parse(user.courses) || []
        console.log(userId, courses, userInterests)

        const prompt = getPrompt(courses, userInterests)
        // console.log(prompt)
        const response = await queryLLM(prompt)
        res.status(200).json({ response, success: true} )
    } catch (err) {
        res.status(500).json({success: false, error: err})
        next(err)
    }
}

function getPrompt(courses, userInterests) {
    const prompt = "Given the following courses taken, interests, and course description list, construct a list of 4-6 recommended courses for this student, along with a short reasoning. Make sure to check course prerequisites, if mentioned.\n" +
    `Courses taken: ${courses.join(', ')}\n` +
    `Interests: ${userInterests}\n` + 
    "Course descriptions: ATTACHED BELOW\n" + 
    "IMPORTANT NOTE: Responses are timed, so limit prose and stick to only the absolutely crucial analysis.\n\n" +
    "COMPLETE COURSE LIST: \n" + 
    JSON.stringify(completeCourseList)

    return prompt
}


async function queryLLM(prompt) {
    const config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommended_courses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  course_name: {
                    type: Type.STRING,
                  },
                  reasoning: {
                    type: Type.STRING,
                  },
                },
              },
            },
          },
        },
      };
    
    const model = 'gemini-2.5-flash-preview-04-17';
    const contents = prompt //+ '\n\n' + createPartFromUri(myfile.uri, myfile.mimeType);
    const response = await ai.models.generateContent({model, config, contents})
    
    if (response.candidates?.[0]?.content?.parts?.[0]?.text)
      return response.candidates[0].content.parts[0].text
    return null
}

function databaseGetCourses(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT courses
             FROM users
             WHERE id = ?`,
            [
                userId
            ],
            (err, user) => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else resolve(user)
            }
        );    
    })
}