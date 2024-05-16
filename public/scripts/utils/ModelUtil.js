class ModelUtil {
    constructor() {}
  
    async saveModel(options) {
      if(!options) return;
      const postData = {
        label:options.label,
        name: options.name,
        description: options.description,
      };

      const record_id = options.record_id || "new";
  
      return await fetch(`/${window._astracms.base_id}/models/${record_id}`, {
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
  