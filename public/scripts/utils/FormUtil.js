import ValidationUtil from "./ValidationUtil.js";
class FormUtil {
  constructor(options) {
    if (!options) return;
    this.form = document.querySelector(options.selector);
    this.mandatoryFields = [];
  }

  init() {
    this.enableMandatoryFields();
    return this;
  }

  getElement(selector) {
    if (!selector) {
      return;
    }
    return this.form.querySelector(selector);
  }


  getElements(selector) {
    if (!selector) {
      return;
    }
    return this.form.querySelectorAll(selector);
  }

  reset() {
    this.form.reset();
    this.getMandatoryFields().forEach((f) => {
      this.setMandatoryFormField(f, false);
    });
    return;
  }

  getValue(selector) {
    let ele = this.form.querySelector(selector);
    if (ele) {
      return ele.value;
    }
  }

  nil(item) {
    return new ValidationUtil().nil(item);
  }

  notNil(item) {
    return new ValidationUtil().notNil(item);
  }

  canSubmit() {
    if (this.nil(this.form)) return;

    let isValid = true;
    this.getMandatoryFields().forEach((f) => {
      if (this.notNil(f.value)) {
        this.setMandatoryFormField(f, false);
      } else {
        isValid = false;
        this.setMandatoryFormField(f, true);
      }
    });

    return isValid;
  }

  getMandatoryFields() {
    this.mandatoryFields = this.form
      ? Array.from(this.form.querySelectorAll("[data-mandatory='true']"))
      : [];

    return this.mandatoryFields;
  }

  enableMandatoryFields() {
    this.getMandatoryFields().forEach((f) => {
      f.addEventListener("change", () => {
        if (this.nil(f.value)) {
          this.setMandatoryFormField(f, true);
        } else {
          this.setMandatoryFormField(f, false);
        }
      });
    });
  }

  setMandatoryFormField(target, bool) {
    if (this.nil(target)) return;
    const formGroup = target.closest("[data-form_group]");
    if (bool) {
      if (target.closest(".dropdown")) {
        target.closest(".dropdown").querySelector("[data-dropdown_btn]").classList.add("border-danger");
      } else {
        target.classList.add("border-danger");
      }
      target.setAttribute("data-invalid_field", bool);
      if (this.notNil(formGroup)) {
        if (formGroup.querySelector("label"))
          formGroup.querySelector("label").classList.add("text-danger");
        let requiredSpan = formGroup.querySelector("span.required");
        if (requiredSpan) {
          requiredSpan.classList.remove("text-secondary");
          requiredSpan.classList.add("text-danger");
        }
      }
    } else {
      //its valid and not mandatory
      if (target.closest(".dropdown")) {
        target.closest(".dropdown").querySelector("[data-dropdown_btn]").classList.remove("border-danger");
      } else {
        target.classList.remove("border-danger");
      }
      if (this.notNil(formGroup)) {
        if (formGroup.querySelector("label"))
          formGroup.querySelector("label").classList.remove("text-danger");
        let requiredSpan = formGroup.querySelector("span.required");
        if (requiredSpan) {
          requiredSpan.classList.remove("text-danger");
          requiredSpan.classList.add("text-secondary");
        }
      }
      target.setAttribute("data-invalid_field", bool);
    }
  }
}

export default FormUtil;
