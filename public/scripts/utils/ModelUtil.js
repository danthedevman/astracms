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

    async saveField(model,options) {
        if(!options) return;
        const postData = options;
        const field_id = options.field_id || "new";
    
        return await fetch(`/${window._astracms.base_id}/models/${model}/fields/${field_id}`, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
      }

      async deleteField(model,options) {
        if(!options) return;  
        const record_id = options.record_id || "new";
    
        return await fetch(`/${window._astracms.base_id}/models/${model}/fields/${record_id}`, {
          method: "DELETE",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          }
        });
      }
  }
  export default ModelUtil;
  