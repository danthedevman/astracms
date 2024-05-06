class BaseUtil {
  constructor() {}

  async createBase(options) {
    const base = {
      name: options.name,
      description: options.description,
    };

    await fetch("/sys_base/new", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(base),
    });
  }
}
export default BaseUtil;
