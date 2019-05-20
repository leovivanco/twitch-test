import { Component, OnInit } from '@angular/core';
import { SearchItemsService } from '../search/search.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  video: any
  constructor(
    private searchItemsService: SearchItemsService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.searchItemsService.searchVideo(this.route.snapshot.params['id'])
      .then((video) => {
        this.video = video
      }).catch((error: any) => alert(`${error}, Something wrong!`));

  }
  transform(url: string) {
    console.log(`https://player.twitch.tv/?channel=${url}`)
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.twitch.tv/?channel=${url}`);
  }
}
