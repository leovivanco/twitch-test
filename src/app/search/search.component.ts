import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
SearchItemsService
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, catchError, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { SearchItemsService } from './search.service';
import { Stream } from '../shared/stream.model';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    private seachItensService: SearchItemsService,
    private cookieService: CookieService
  ) { }
  @ViewChild('selectResults')
  selectResults: ElementRef;
  @ViewChild('inputSearch')
  inputSearch: ElementRef;
  subjectStrams: Subject<string> = new Subject<string>();
  streams = []
  ngOnInit() {
    this.changeValueLimitByCookie();
    this.subjectStrams.pipe(
      debounceTime(900),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.trim() === '') {
          return of<Stream[]>([])
        }
        return this.seachItensService.searchStreams(term, parseInt(this.selectResults.nativeElement.value));
      }),
      catchError((error: any) => {
        alert(error + ' Error')
        return of<Stream[]>([])
      })
    ).subscribe((stream: Stream[]) => this.streams = stream)
  }
  searchStreamsInput(query: string) {
    if (this.inputSearch.nativeElement.value && !this.streams.length) {
      console.log(this.inputSearch.nativeElement.value)
    }
    this.subjectStrams.next(query)
  }

  filterResultsByLimit(selectResults: string) {
    this.cookieService.set('StreamLimit', selectResults);
    this.changeValueLimitByCookie();
    if (this.inputSearch.nativeElement.value) {
        this.seachItensService.searchStreams(this.inputSearch.nativeElement.value, parseInt(selectResults)).subscribe((stream: Stream[]) => this.streams = stream);
    }


  }

  changeValueLimitByCookie() {
    if (this.cookieService.get('StreamLimit')) {
      this.selectResults.nativeElement.value = this.cookieService.get('StreamLimit')
    }
  }

}
