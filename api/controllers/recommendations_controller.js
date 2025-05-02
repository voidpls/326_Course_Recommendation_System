require('dotenv').config()
const { GEMINI_API_KEY } = process.env
const { GoogleGenAI, Type, createPartFromUri } = require("@google/genai")
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
const completeCourseListPath = '/src/Services/course-details-page/complete_course_list.json'

const memoryStore = {
    1: { 
        userId: 1, 
        courseProgress: { 
            "selectedIds": [ "MATH131", "MATH132", "MATH233_or_STAT315", "MATH235", "CICS110", "CICS160", "CICS210", "CS240", "CS250", "CS220", "CS230", "CS_300_elective_1", "CS320_or_CS326", "CICS305" ], 
            "inputValues": { "CS_300_elective_1_input": "383" } 
        }, 
        courses: [ "MATH131", "MATH132", "MATH233_or_STAT315", "MATH235", "CICS110", "CICS160", "CICS210", "CS240", "CS250", "CS220", "CS_300_elective_1: 383", "CS320_or_CS326", "CICS305" ]
    }
} 

exports.getRecommendations = async (req, res, next) => {
    let { userId, userInterests } = req.body;
    try {
        userId = parseInt(userId)
        const { courses } = memoryStore[userId]
        console.log(userId, courses, userInterests)

        const prompt = getPrompt(courses, userInterests)
        console.log(prompt)
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
    "Course descriptions: ATTACHED\n" + 
    "IMPORTANT NOTE: Responses are timed, so limit prose and stick to only the absolutely crucial analysis."
   
    return prompt
}

function getUploadedJSON() {
    let uploadedJSON;
    return async () => {
        if (uploadedJSON) return uploadedJSON
        // const json = require(completeCourseListPath)
        // console.log(json)
        uploadedJson = await ai.files.upload({
            file: completeCourseListPath,
            config: {mimeType: 'application/json'} 
        })
        return uploadedJSON
    }
}

async function queryLLM(prompt) {
    const uploadedJSON = getUploadedJSON()

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
    
    const myfile = await uploadedJSON()
    const model = 'gemini-2.5-flash-preview-04-17';
    const contents = prompt + '\n\n' + createPartFromUri(myfile.uri, myfile.mimeType);
    const response = await ai.models.generateContent({model, config, contents})

    return response
}
