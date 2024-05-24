class ContentUtil {
    constructor() {}
  
    async save(options) {
      if(!options) return;
      const postData = options.form_data;
      const model_id = options.model_id;
      const record_id = options.record_id || "new";
  
      return await fetch(`/${window._astracms.base_id}/content/${model_id}/${record_id}`, {
        method: "POST",
        credentials: "same-origin",
        body:postData,
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
  export default ContentUtil;
  