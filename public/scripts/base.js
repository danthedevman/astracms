(() => {

  //hide custom dropdowns when clicked outside
  document.querySelector("body").onclick = (evt) => {
    if (evt.target.closest(".dropdown")) {
      return;
    }

    document.querySelectorAll(".dropdown-menu").forEach((ele) => {
      ele.classList.remove("show");
    });
  };
})();

/*
const sys_modelDoc = {
  name:"",
  label:"",
  fields:[],
  records:[],
  _id:"",
  parent:""
}

const childSys_modelDoc = {
  name:"",
  label:"",
  fields:[],
  records:[],
  _id:"",
  parent:""
}*/

//if document is exceeding 16mb size, create new document and referenc old one
//run query for this model and then query for documents with matching parent object id
//if found concatenate and fields and records arrays and perform sorts and filters against them
//if new record, once submitted to server check bson size of doc and if at 15mb (1mb short of max) find a parent record doc otherwise create one and push into records


