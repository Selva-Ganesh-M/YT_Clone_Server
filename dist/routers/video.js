"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videoController_1 = require("../controllers/videoController");
const authorization_1 = require("../middlewares/authorization");
const auth_validation_1 = require("../middlewares/validation/auth.validation");
const videoSchema_1 = require("../validationSchemas/videoSchema");
const router = express_1.default.Router();
// create a video
router.post("/create", authorization_1.authorization, (0, auth_validation_1.validator)(videoSchema_1.videoSchema.createVideoSchema), videoController_1.videoController.createVideo);
// update video
router.post("/update/:id", authorization_1.authorization, (0, auth_validation_1.validator)(videoSchema_1.videoSchema.updateVideoSchema), videoController_1.videoController.updateVideo);
// delete a video
router.delete("/delete/:id", authorization_1.authorization, (0, auth_validation_1.validator)(videoSchema_1.videoSchema.deleterUserSchema), videoController_1.videoController.deleteVideo);
// like a video
router.put("/like/:id", authorization_1.authorization, (0, auth_validation_1.validator)(videoSchema_1.videoSchema.likeAVideoSchema), videoController_1.videoController.likeVideo);
// like a video
router.put("/dislike/:id", authorization_1.authorization, (0, auth_validation_1.validator)(videoSchema_1.videoSchema.likeAVideoSchema), videoController_1.videoController.dislike);
// fetchRandom videos
router.get("/random", videoController_1.videoController.getRandomVids);
// search
router.get("/search", (0, auth_validation_1.validator)(videoSchema_1.videoSchema.searchVideo), videoController_1.videoController.searchVideo);
// subscribed users videos
router.get("/subs", authorization_1.authorization, videoController_1.videoController.subscribedUsersVideo);
// filter by tags
router.get("/filter", (0, auth_validation_1.validator)(videoSchema_1.videoSchema.getVideosByTagsSchema), videoController_1.videoController.searchByTags);
// get trend vids
router.get("/trend", videoController_1.videoController.trendVideos);
// get a video
router.get("/:id", (0, auth_validation_1.validator)(videoSchema_1.videoSchema.getAVideoSchema), videoController_1.videoController.getAVideo);
// inc view count of a video
router.post("/view/:id", (0, auth_validation_1.validator)(videoSchema_1.videoSchema.viewAVideoSchema), videoController_1.videoController.incViewOfVideo);
// exports
const videoRouter = router;
exports.default = videoRouter;
