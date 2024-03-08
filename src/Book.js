const vscode = require("vscode");
const fs = require("fs");

function log(...msg) {
  console.log(msg);
}

function getConfig(key) {
  return vscode.workspace.getConfiguration().get(key);
}

function updateConfig(key, value) {
  return vscode.workspace.getConfiguration().update(key, value, true);
}

function updatePage(n) {
  log("updatePage", n);
  n = n < 1 ? 1 : n;
  updateConfig("bookReader.currPageNumber", n);
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
    var n = getConfig("bookReader.currPageNumber");
    return n == null || n < 1 ? 1 : n;
  }
  init() {
    const filePath = getConfig("bookReader.filePath");
    const pageSize = getConfig("bookReader.pageSize");
    const data = fs.readFileSync(filePath, "utf8");
    this.cleanedData = data.replace(/\s+/g, " ");
    this.lines = new Array();
    for (let i = 0; i < this.cleanedData.length; i += pageSize) {
      this.lines.push(this.cleanedData.slice(i, i + pageSize));
    }
    this.total = this.lines.length + 1;
    this.calcKeywords();
  }
  calcKeywords() {
    var keyWords = getConfig("bookReader.keyWords");
    if (keyWords) {
      log("keyWords", keyWords);
      const index = this.cleanedData.indexOf(keyWords);
      if (index !== -1) {
        const pageSize = getConfig("bookReader.pageSize");
        updatePage(Math.floor(index / pageSize));
        updateConfig("bookReader.keyWords", "");
        return true;
      }
      updateConfig("bookReader.keyWords", "");
    }
    return false;
  }

  calc(i) {
    if (this.status !== "done") {
      return this.status;
    }
    var n = this.calcKeywords()
      ? this.pageNum()
      : updatePage(this.pageNum() + i);
    log("loadText", n);
    return this.lines[n - 1] + "    " + n + "/" + this.lines.length;
  }
}

module.exports = Book;
