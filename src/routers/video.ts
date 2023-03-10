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

// like a video
router.put(
    "/like/:id",
    authorization,
    validator(videoSchema.likeAVideoSchema),
    videoController.likeVideo
)

// like a video
router.put(
    "/dislike/:id",
    authorization,
    validator(videoSchema.likeAVideoSchema),
    videoController.dislike
)

// fetchRandom videos
router.get("/random", videoController.getRandomVids)

    
// search
router.get(
    "/search", 
    validator(videoSchema.searchVideo), 
    videoController.searchVideo)
    
// subscribed users videos
router.get(
    "/subs", 
    authorization,
    videoController.subscribedUsersVideo
    )

// filter by tags
router.get(
    "/filter",
    validator(videoSchema.getVideosByTagsSchema),
    videoController.searchByTags
)

// get trend vids
router.get(
    "/trend",
    videoController.trendVideos
    )

// get a video
router.get("/:id",
    validator(videoSchema.getAVideoSchema), 
    videoController.getAVideo
)

// inc view count of a video
router.post("/view/:id",
    validator(videoSchema.viewAVideoSchema),
    videoController.incViewOfVideo
)



// exports
const videoRouter = router
export default videoRouter
