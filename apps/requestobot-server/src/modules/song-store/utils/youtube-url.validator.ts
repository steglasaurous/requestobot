import { Injectable } from '@nestjs/common';

@Injectable()
export class YoutubeUrlValidator {
  private urlRegex =
    /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

  public isValidYoutubeUrl(url: string): boolean {
    return !!String(url).match(this.urlRegex);
  }

  public getYoutubeVideoId(url: string): string | null {
    const match = this.urlRegex.exec(url);
    return match ? match[1] : null;
  }
}
