import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage';

import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  @Input() file!: File;
  @Output() completed = new EventEmitter<string>();

  percentage$ = new BehaviorSubject<number>(0);
  downloadURL!: string;
  task!: UploadTask;

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

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.percentage$.next(progress);
      },
      (error) => {
        console.error('Error uploading:', error);
      },
      async () => {
        this.downloadURL = await getDownloadURL(storageRef);
        this.completed.next(this.downloadURL);
      }
    );
  }
  pauseUpload(): void {
    this.task.pause();
  }

  resumeUpload(): void {
    this.task.resume();
  }

  cancelUpload(): void {
    this.task.cancel();
  }
}
