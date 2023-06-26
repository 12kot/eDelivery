//Если ошибка - возвращаем false
class AuthValidate {
  message: string;
  email: string;
  pass: string;
  repeatPass: string;

  constructor(email: string, pass: string, repeatPass?: string) {
    this.message = "";
    this.email = email;
    this.pass = pass;
    this.repeatPass = repeatPass ? repeatPass : "";
  }

  PassValidator(): boolean {
    return (
      !this._IsEmptyString(this.pass) &&
      !this._IsEmptyString(this.repeatPass) &&
      this._PassLenthValidator() &&
      this._PassCaseValidator() &&
      this._WhitespaseValidator(this.pass)
    );
  }

  EmailValidator(): boolean {
    return (
      !this._IsEmptyString(this.email) &&
      this._WhitespaseValidator(this.email) &&
      this._IsValidEmail()
    );
  }

  _PassCaseValidator(): boolean {
    if (
      this.pass.toLowerCase() !== this.pass &&
      this.pass.toUpperCase() !== this.pass
    )
      return true;

    this.message =
      "Пароль должен содержать символы в нижнем и в ВЕРХНЕМ регистре";
    return false;
  }

  _PassLenthValidator(): boolean {
    if (this.pass.length >= 6) return true;

    this.message = "Пароль должен быть длинее 6 символов";
    return false;
  }

  _WhitespaseValidator(str: string): boolean {
    if (!str.includes(" ")) return true;

    this.message = "Поле не может содержать символы пробела";
    return false;
  }

  _IsEmptyString(str: string): boolean {
    if (str.trim().length !== 0) return false;

    this.message = "Все поля должны быть заполнены";
    return true;
  }

  RepeatPassValidator(): boolean {
    if (this.pass.trim() === this.repeatPass.trim()) return true;

    this.message = "Введены различные пароли. Проверьте правильность ввода";
    return false;
  }

  _IsValidEmail(): boolean {
    const atIndex = this.email.indexOf("@");
    if (
      atIndex === this.email.lastIndexOf("@") &&
      atIndex !== -1 &&
      atIndex !== this.email.length - 1 &&
      this.email.includes(".", atIndex) &&
      this.email.lastIndexOf(".") !== this.email.length - 1
    )
      return true;

    this.message = "Введёно неверное значение почты";
    return false;
  }

  GetErrorMessage(): string {
    return this.message;
  }
}

export default AuthValidate;
