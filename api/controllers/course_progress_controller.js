const memoryStore = {
    1: { 
        userId: 1, 
        courseProgress: { 
            "selectedIds": [ "MATH131", "MATH132", "MATH233_or_STAT315", "MATH235", "CICS110", "CICS160", "CICS210", "CS240", "CS250", "CS220", "CS_300_elective_1", "CS320_or_CS326", "CICS305" ], 
            "inputValues": { "CS_300_elective_1_input": "383" } 
        }, 
        courses: [ "MATH131", "MATH132", "MATH233_or_STAT315", "MATH235", "CICS110", "CICS160", "CICS210", "CS240", "CS250", "CS220", "CS_300_elective_1: 383", "CS320_or_CS326", "CICS305" ]
    }
} 

exports.getProgress = async (req, res, next) => {
    let { userId } = req.params;
    try {
        userId = parseInt(userId)
        if (!memoryStore[userId]) 
          return res.json({success: false, error: "This user ID does not exist"})
        
        res.status(200).json({ ...memoryStore[userId], success: true} )
    } catch (err) {
        res.status(500).json({success: false, error: err})
        next(err)
    }
}

exports.setProgress = async (req, res, next) => {
    let { userId, courseProgress, courses } = req.body
    try {
        console.log(req.body)

        userId = parseInt(userId)
        memoryStore[userId] = { userId, courseProgress, courses }
        // res.json({ userId, courseProgress, courses });
        res.status(200).json({success: true})
    } catch (err) {
        res.status(500).json({success: false, error: err})
        next(err)
    }
}

exports.deleteProgress = async (req, res, next) => {
    let { userId } = req.params;
    try {
        userId = parseInt(userId)
        if (!memoryStore[userId]) 
            return res.json({success: false, error: "This user ID does not exist"})
        
        delete memoryStore[userId]
        res.status(200).json({success: true})
    } catch (err) {
        res.status(500).json({success: false, error: err})
        next(err)
    }
}