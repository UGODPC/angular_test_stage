import { Component, Output , EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  active: string = "login";
  firstName: string = "";
  lastName: string = "";
  login: string = "";
  password: string = "";

  onLoginTab(): void
  {
    this.active = "login";
  }

  onRegisterTab(): void
  {
    this.active = "register";
  }

  onSubmitLogin(): void {
    this.onSubmitLoginEvent.emit({"login": this.login, "password": this.password});
  }

  onSubmitRegister(): void {
    this.onSubmitRegisterEvent.emit({"firstName":this.firstName, "lastName":this.lastName, "login":this.login, "password":this.password});
  }
}
