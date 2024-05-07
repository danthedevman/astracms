class ModelUtil {
    constructor() {}
  
    async createModel(options) {
      const base = {
        name: options.name,
        description: options.description,
      };
  
      await fetch("/new", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(base),
      });
    }
  }
  export default ModelUtil;
  