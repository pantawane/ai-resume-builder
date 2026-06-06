import imagekit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

// controller for creating a new resume
// POST: /api/resumes/create


export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        // create new resume
        const newResume = await Resume.create({userId, title});
        // return success message
        return res.status(201).json({message: 'Resume created successfully', resume: newResume})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for deleting a resume
// DELETE: /api/resumes/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({ userId,_id: resumeId});

        // return success message
        return res.status(200).json({message: 'Resume deleted successfully'})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//get user resume by id
// GET: /api/resumes/get

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({ userId,_id: resumeId});

        if(!resume){
            return res.status(404).json({message: 'Resume not found'})
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        // return success message
        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//get resume by id public
// GET: /api/resumes/public

export const getPublicResumeById= async (req, res) => {
    try {
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId});

        if(!resume){
            return res.status(404).json({message: 'Resume not found'})
        }

        return res.status(200).json({resume})

    }catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for updating a resume
// PUT: /api/resumes/update

export const updateResume = async (req, res) => {
    try {

        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;

        // #region agent log
        try{fs.appendFileSync('debug-0e337a.log',JSON.stringify({sessionId:'0e337a',location:'resumeController.js:updateResume',message:'updateResume entry',data:{hasFile:!!image,fileName:image?.originalname,fileSize:image?.size,removeBackground,resumeId:!!resumeId},timestamp:Date.now(),hypothesisId:'C,D'})+'\n');}catch(_){}
        // #endregion

        let resumeDataCopy;
        if (typeof resumeData === 'string') {
            resumeDataCopy = await JSON.parse(resumeData)
        }else{
            resumeDataCopy = structuredClone(resumeData)
        }

        
        if(image) {

            const imageBufferData = fs.createReadStream(image.path)

            const response = await imagekit.files.upload ({
                             file: imageBufferData,
                             fileName: 'resume.png',
                             folder: 'user-resumes',
                             transformation: {
                                pre: 'w-300, h-300, fo-face, z-0.75' +
                                (removeBackground ? ', e-bgremove' : '')
                             }
                            });

            resumeDataCopy.personal_info.image = response.url;
            // #region agent log
            try{fs.appendFileSync('debug-0e337a.log',JSON.stringify({sessionId:'0e337a',location:'resumeController.js:updateResume',message:'imagekit upload success',data:{imageUrl:response.url?.substring(0,80)},timestamp:Date.now(),hypothesisId:'D'})+'\n');}catch(_){}
            // #endregion
        }
        const resume = await Resume.findOneAndUpdate({userId, _id: resumeId}, resumeDataCopy,
            {new: true}
        );
        if (!resume) {
            return res.status(404).json({message: 'Resume not found'})
        }
        return res.status(200).json({message: 'Saved successfully', resume})
        
    } catch (error) {
        // #region agent log
        try{fs.appendFileSync('debug-0e337a.log',JSON.stringify({sessionId:'0e337a',location:'resumeController.js:updateResume',message:'updateResume error',data:{errorMessage:error?.message},timestamp:Date.now(),hypothesisId:'C,D'})+'\n');}catch(_){}
        // #endregion
        return res.status(400).json({message: error.message})
    }
}