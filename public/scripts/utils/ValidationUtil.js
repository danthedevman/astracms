class ValidationUtil {
    constructor() {}
  
    nil(item) {
      return (
        item == null ||
        typeof item == "undefined" ||
        "" == "" + String(item).replace(/\s/g, "")
      );
    }
  
    notNil(item) {
      return !this.nil(item);
    }
  }
  
  export default ValidationUtil;  