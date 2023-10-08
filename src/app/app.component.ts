import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from './store';
import * as fromDictionaries from './store/dictionaries';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    const x = new fromDictionaries.Read();
    console.log(x);
    this.store.dispatch(new fromDictionaries.Read());
  }
}
