import { ApiService } from "./request";

export class YoutubeService {
  static getSrcLink(videoId: string) {
    return `https://youtu.be/${videoId}`;
  }

  static getVideoPicUrl(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  static getVideoCaption(id: string, lang: string) {
    return ApiService.get(`/gcloud/youtube/getSubs?videoId=${id}&lang=${lang}`);
  }

  static getVideoInfo(id: string) {
    return ApiService.get(`/gcloud/youtube/getInfo?videoId=${id}`);
  }

  static updateVideo(body: Object) {
    return ApiService.post(`/api/videos/update`, body);
  }

  static createVideo(body: Object) {
    return ApiService.post(`/api/videos/create`, body);
  }

  static getTextPinyin(body: Object) {
    return ApiService.post(`/api/dictionary/getTextPinyin`, body);
  }
}
