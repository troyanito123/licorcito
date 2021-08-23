import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user.model';
import { MessageService } from 'src/app/services/message.service';
import { AppState } from 'src/app/state/app.reducer';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-order-chat',
  templateUrl: './order-chat.component.html',
  styleUrls: ['./order-chat.component.scss'],
})
export class OrderChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  orderId: string;

  @ViewChild('messagesBox') private messagesBox: ElementRef;

  @ViewChild('inputId', { static: false }) inputElement: IonInput;

  messages: Message[] = [];

  newMessage = new FormControl('', Validators.required);

  user: User;
  userSubs: Subscription;

  isLoading = false;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        tap(({ id }) => (this.orderId = id)),
        switchMap(({ id }) => this.messageService.getMessages(id))
      )
      .subscribe((messages) => {
        this.messages = messages;
        this.scrollToBottom();
      });

    this.userSubs = this.store
      .select('auth')
      .subscribe(({ user }) => (this.user = user));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.inputElement.setFocus();
  }

  ngOnDestroy() {
    this.userSubs?.unsubscribe();
  }

  sendMessage() {
    if (this.newMessage.invalid) {
      return;
    }
    this.isLoading = true;
    this.messageService
      .create(this.newMessage.value, this.orderId, this.user)
      .then(() => {
        this.isLoading = false;
        this.newMessage.reset();
      })
      .catch(async (err) => {
        const toast = await this.utilService.createToast(err.message);
        this.isLoading = false;
        toast.present();
      });
  }

  private scrollToBottom(): void {
    try {
      this.messagesBox.nativeElement.scrollTop =
        this.messagesBox.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
