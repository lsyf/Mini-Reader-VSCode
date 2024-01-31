const vscode = require("vscode");
const fs = require("fs");
class Book {
  constructor(extensionContext) {
    this.curr_page_number = 1;
    this.page_size = 50;
    this.page = 0;
    this.start = 0;
    this.end = this.page_size;
    this.filePath = "";
    this.extensionContext = extensionContext;
    this.keyWords = "";
  }
  getSize(text) {
    let size = text.length;
    this.page = Math.ceil(size / this.page_size);
  }
  getFileName() {
    var file_name = this.filePath.split("/").pop();
    console.log(file_name);
  }
  getPage(type) {
    var curr_page = vscode.workspace
      .getConfiguration()
      .get("bookReader.currPageNumber");
    var page = 0;
    if (this.keyWords !== "") {
      // 跳转关键词位置
      let text = this.readFile();
      const index = text.indexOf(this.keyWords);
      if (index > -1) {
        page = Math.floor(index / this.page_size) + 1;
      } else {
        page = this.curr_page_number;
      }
    } else if (type === "previous") {
      if (curr_page <= 1) {
        page = 1;
      } else {
        page = curr_page - 1;
      }
    } else if (type === "next") {
      if (curr_page >= this.page) {
        page = this.page;
      } else {
        page = curr_page + 1;
      }
    } else if (type === "curr") {
      page = curr_page;
    }
    this.curr_page_number = page;
  }
  updatePage() {
    vscode.workspace
      .getConfiguration()
      .update("bookReader.currPageNumber", this.curr_page_number, true);
  }
  getStartEnd() {
    this.start = this.curr_page_number * this.page_size;
    this.end = this.curr_page_number * this.page_size - this.page_size;
  }
  readFile() {
    if (this.filePath === "" || typeof this.filePath === "undefined") {
      vscode.window.showWarningMessage("请填写书籍文件路径");
    }
    var data = fs.readFileSync(this.filePath, "utf-8");
    var line_break = " ";
    return data
      .toString()
      .replace(/\n/g, line_break)
      .replace(/\r/g, " ")
      .replace(/　　/g, " ")
      .replace(/ /g, " ");
  }
  init() {
    this.filePath = vscode.workspace
      .getConfiguration()
      .get("bookReader.filePath");
    this.page_size = vscode.workspace
      .getConfiguration()
      .get("bookReader.pageSize");
    this.keyWords = vscode.workspace
      .getConfiguration()
      .get("bookReader.keyWords");
  }
  getPrePage() {
    this.init();
    let text = this.readFile();
    this.getSize(text);
    this.getPage("previous");
    this.getStartEnd();
    var page_info =
      this.curr_page_number.toString() + "/" + this.page.toString();
    this.updatePage();
    return text.substring(this.start, this.end) + "    " + page_info;
  }
  getNextPage() {
    this.init();
    let text = this.readFile();
    this.getSize(text);
    this.getPage("next");
    this.getStartEnd();
    var page_info =
      this.curr_page_number.toString() + "/" + this.page.toString();
    this.updatePage();
    return text.substring(this.start, this.end) + "    " + page_info;
  }
}

module.exports = Book;
