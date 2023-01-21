import express from "express"
import { videoController } from "../controllers/videoController";
import { authorization } from "../middlewares/authorization";
import { validator } from "../middlewares/validation/auth.validation";
import { videoSchema } from "../validationSchemas/videoSchema";

const router = express.Router();


// create a video
router.post(
    "/create",
    authorization,
    validator(videoSchema.createVideoSchema),
    videoController.createVideo
)

// update video
router.post(
    "/update/:id",
    authorization,
    validator(videoSchema.updateVideoSchema),
    videoController.updateVideo
)

// delete a video
router.delete(
    "/delete/:id",
    authorization,
    validator(videoSchema.deleterUserSchema),
    videoController.deleteVideo,
)

// fetchRandom videos
router.get("/random", videoController.getRandomVids)


// get a video
router.get(
    "/:id", 
    validator(videoSchema.getAVideoSchema), 
    videoController.getAVideo
    )

const videoRouter = router
export default videoRouter
