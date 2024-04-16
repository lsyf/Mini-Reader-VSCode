const vscode = require("vscode");
const fs = require("fs");

function log(...msg) {
  console.log(msg);
}

function getConfig(key) {
  return vscode.workspace.getConfiguration().get("bookReader." + key);
}

function updateConfig(key, value) {
  return vscode.workspace
    .getConfiguration()
    .update("bookReader." + key, value, true);
}

function updatePage(n) {
  log("updatePage", n);
  n = n < 1 ? 1 : n;
  updateConfig("currPageNumber", n);
  return n;
}

class Book {
  constructor(cb) {
    try {
      this.status = "loading";
      this.init();
      this.status = "done";
    } catch (e) {
      log(e);
      this.status = "error";
    }
    cb(this.status);
  }
  pageNum() {
    var n = getConfig("currPageNumber");
    return n == null || n < 1 ? 1 : n;
  }
  init() {
    this.enabled = getConfig("enabled");
    this.pageSize = getConfig("pageSize");
    const filePath = getConfig("filePath");
    const data = fs.readFileSync(filePath, "utf8");
    this.cleanedData = data.replace(/\s+/g, " ");
    this.lines = new Array();
    for (let i = 0; i < this.cleanedData.length; i += this.pageSize) {
      this.lines.push(this.cleanedData.slice(i, i + this.pageSize));
    }
  }
  find(d) {
    var keyWords = getConfig("keyWords");
    log("find", d, keyWords);
    var n = this.pageNum();
    if (keyWords) {
      var index = -1;
      if (d === "pre") {
        const current = (n - 1) * this.pageSize;
        index = this.cleanedData.lastIndexOf(keyWords, current);
      } else {
        const current = n * this.pageSize;
        index = this.cleanedData.indexOf(keyWords, current);
      }
      if (index !== -1) {
        n = updatePage(Math.floor(index / this.pageSize) + 1);
      }
    }
    return this.text(n);
  }

  calc(i) {
    log("calc", i);
    if (this.status !== "done") {
      return this.status;
    }
    var n = updatePage(this.pageNum() + i);
    return this.text(n);
  }
  text(n) {
    log("text", n);
    const max = this.lines.length;
    if (max === 0) {
      return "";
    }
    n = n < 1 ? 1 : n;
    n = n > max ? max : n;
    return this.lines[n - 1] + "    " + n + "/" + max;
  }
  switchEnabled() {
    this.enabled = !this.enabled;
    updateConfig("enabled", this.enabled);
    return this.enabled ? this.text(this.pageNum()) : "vue is working";
  }
}

module.exports = Book;
