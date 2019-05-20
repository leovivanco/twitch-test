import { Injectable } from '@angular/core';
import { API } from '../shared/api';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Stream } from '../shared/stream.model';
@Injectable({
  providedIn: 'root'
})
export class SearchItemsService {
  constructor(private http: HttpClient) { }
  streamsComplete: Observable<Stream[]>;

  getSreams() {
    return this.streamsComplete
  }

  searchStreams(query: string, limit: number): Observable<Stream[]> {
    const querys: string = [
      `?client_id=${API.id}`,
      `q=${query}`,
      `limit=${limit}`,
    ].join('&');
    // return this.http.get(`https://api.twitch.tv/kraken//streams?client_id=qyxrk320s0583sbi4tcnhcsq01n82jm&q=`)
    return this.http.get(`${API.url + querys}`)
      .pipe(
        retry(5),
        map((resp: any) => resp.streams)
      )
  }
  async searchVideo(id:number){
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'gitfhflgweofmdosbjnmukrns1ukbj'
    })
    return this.http.get(`${API.urlVideo + id}`, { headers })
      .toPromise()
      .then((resp: any) => resp.stream)
      .catch((error: any) => error)
  }
}
