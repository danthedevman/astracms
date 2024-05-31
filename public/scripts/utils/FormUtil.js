import ValidationUtil from "./ValidationUtil.js";
class FormUtil {
  constructor(options) {
    if (!options) return;
    this.form = document.querySelector(options.selector);
    this.mandatoryFields = [];
  }

  init() {
    this.enableMandatoryFields();
    this.enableReferenceFields();
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

  getFieldValueObject(name, value, display_value) {
    const answer = {};
    answer[name] = { value: value, display_value: display_value };
    return answer;
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
        target
          .closest(".dropdown")
          .querySelector("[data-dropdown_btn]")
          .classList.add("border-danger");
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
        target
          .closest(".dropdown")
          .querySelector("[data-dropdown_btn]")
          .classList.remove("border-danger");
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

  enableReferenceFields() {
    const referenceFields = this.form.querySelectorAll("[data-lookup]");

    referenceFields.forEach((field) => {
      let deferLookup;
      let dropdown = field.closest(".dropdown").querySelector(".dropdown-menu");
      let showOnFocus = true
      field.onfocus = async (evt)=>{
        if(showOnFocus){
          let json = await this.searchReference(field);
            let template = "";
            json.results.forEach((result) => {
              template += `<li class="list-group-item border-0 bg-dark p-0""><a class="d-block w-100" data-result data-value="${result._id.toString()}" data-display_value="${
                result._title
              }" href="javascript:void(0)">${result._title}</a></li>`;
            });
            const results = evt.target
              .closest(".dropdown")
              .querySelector("[data-lookup_results]");
            results.innerHTML = template;
            evt.target
              .closest(".dropdown")
              .querySelectorAll("[data-result]")
              .forEach((r) => {
                r.onclick = (e) => {
                  e.preventDefault();
                  evt.target
                    .closest(".dropdown")
                    .querySelector("[data-lookup_value")
                    .setAttribute("value", r.getAttribute("data-value"));
                  evt.target
                    .closest(".dropdown")
                    .querySelector("[data-lookup]").value =
                    r.getAttribute("data-display_value");
                  dropdown.classList.remove("show");
                };
              });
          
          dropdown.classList.add("show");
        }
        showOnFocus = false;
      }

      field.onkeyup = (evt) => {
        clearTimeout(deferLookup);
        deferLookup = setTimeout(async () => {
           let json = await this.searchReference(field);
            let template = "";
            json.results.forEach((result) => {
              template += `<li class="list-group-item border-0 bg-dark p-0""><a class="d-block w-100" data-result data-value="${result._id.toString()}" data-display_value="${
                result._title
              }" href="javascript:void(0)">${result._title}</a></li>`;
            });
            const results = evt.target
              .closest(".dropdown")
              .querySelector("[data-lookup_results]");
            results.innerHTML = template;
            evt.target
              .closest(".dropdown")
              .querySelectorAll("[data-result]")
              .forEach((r) => {
                r.onclick = (e) => {
                  e.preventDefault();
                  evt.target
                    .closest(".dropdown")
                    .querySelector("[data-lookup_value")
                    .setAttribute("value", r.getAttribute("data-value"));
                  evt.target
                    .closest(".dropdown")
                    .querySelector("[data-lookup]").value =
                    r.getAttribute("data-display_value");
                  dropdown.classList.remove("show");
                };
              });
          

          dropdown.classList.add("show");
        }, 300);
      };
    });
  }

  async searchReference(field){
    let res = await fetch(
      `/${window._astracms.base_id}/${field.getAttribute("data-lookup")}/search?sys_text_search=${encodeURI(field.value)}`
    );

    if (res.status === 200) {
      return await res.json();
    }
  }
}

export default FormUtil;
