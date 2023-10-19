import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';

import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  @Input() file!: File;
  @Output() completed = new EventEmitter<string>();

  percentage$!: Observable<number>;
  // snapshot$!: Observable<firebase.storage.UploadTaskSnapshot>;
  downloadURL!: string;

  private destroy = new Subject<void>();

  private storage = getStorage();
  constructor() {}

  ngOnInit(): void {
    this.startUpload();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  startUpload(): void {
    const path = `${this.file.type.split('/')[0]}/${Date.now()}_${
      this.file.name
    }`;

    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, this.file);

    // this.percentage$ = this.task.percentageChanges();
    // this.snapshot$ = this.task.snapshotChanges();

    // this.snapshot$
    //   .pipe(
    //     takeUntil(this.destroy),
    //     finalize(async () => {
    //       this.downloadURL = await storageRef.getDownloadURL().toPromise();

    //       this.completed.next(this.downloadURL);
    //     })
    //   )
    //   .subscribe();
  }
}
