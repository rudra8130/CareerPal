import dotenv from "dotenv"
import axios from "axios"
dotenv.config()


const BASE_URL = "https://www.googleapis.com/youtube/v3/search"

const searchVideo = async (topic) => {
    try {
        let query = `${topic} tutorial full course`

        let { data } = await axios.get(BASE_URL, {
            params: {
                q: query,
                type: "video",
                maxResults: 1,
                key: process.env.YOUTUBE_API_KEY,
                part: "snippet"
            }
        })
        if (data.items.length > 0) {

            const video = data.items[0];

            return {

                title: video.snippet.title,
                channel: video.snippet.channelTitle,
                url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            };
        }

        return null


    } catch (error) {
        console.log("Youtube Error")
        console.log(error)
        return null
    }
}

export default searchVideo