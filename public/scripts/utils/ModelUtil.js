class ModelUtil {
    constructor() {}
  
    async createModel(options) {
      const postData = {
        name: options.name,
        description: options.description,
      };
  
      await fetch(`/${window._astracms.base_id}/models/new`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    }
  }
  export default ModelUtil;
  