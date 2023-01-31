import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Defines } from 'src/app/shared/statics/defines';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit,OnDestroy {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })
  showPassword!: boolean;
  urlRoute: string = 'daily/home/dashboard';
  loginSubscription!: Subscription;
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit() {
    let user: User = this.loginForm.value
   this.loginSubscription = this.authenticationService.login(user).subscribe((response: any) => {
      console.log('userData', response);
      if (response.statusCode == 0) {
        let privileges =response.payload.user.profileModel.privileges;
        let userId =response.payload.user.userId;
        localStorage.setItem('userId',JSON.stringify(userId));
        localStorage.setItem('privileges',JSON.stringify(privileges));
        this.router.navigateByUrl(this.urlRoute);
      }
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

}
